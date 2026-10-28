import {
  ActivityBookingStatus,
  Booking,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { InboundMessageDto, WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from '../booking.service';
import { BookingWithRelationsDto } from '../dto';
import {
  buildOwnerReplyAcknowledgedMessage,
  buildOwnerReplyAmbiguousMessage,
} from '../helper/booking-message.helper';
import {
  buildBookingCode,
  OwnerReplyIntent,
  parseOwnerReply,
} from '../helper/booking-owner-reply.parser';

/**
 * Statuses in which a booking is still waiting on the owner's word. A reply
 * that arrives after the admin has already moved the booking on is deliberately
 * not matched — the decision has been taken by then.
 */
const AWAITING_OWNER_CONFIRMATION_STATUSES = [
  VillaBookingStatus.Requested,
  ActivityBookingStatus.Pending,
];

export enum OwnerReplyOutcome {
  /** Not from a known owner, or the reply carried no usable answer. */
  Ignored = 'ignored',
  /** A known owner, but nothing of theirs is waiting on an answer. */
  NoPendingBooking = 'no_pending_booking',
  /** Several bookings are waiting and the reply did not say which. */
  Ambiguous = 'ambiguous',
  /** The booking's status was moved. */
  Applied = 'applied',
  /** Understood, but the booking was already in the right state. */
  Acknowledged = 'acknowledged',
  /** Understood, but the status change was rejected. */
  Failed = 'failed',
}

export interface OwnerReplyResult {
  outcome: OwnerReplyOutcome;
  bookingId?: string;
  status?: ActivityBookingStatus | VillaBookingStatus;
  reason?: string;
}

/**
 * Turns a property owner's WhatsApp reply into a booking status change.
 *
 * This closes the one manual link left in the inquiry flow: the owner is asked
 * over WhatsApp whether the dates are free, and until now a human had to read
 * that answer and click through the dashboard.
 *
 * Everything here is written to fail closed. An unrecognised sender, an
 * unrecognised phrase or an ambiguous match all leave the booking untouched for
 * the admin, because the alternative — opening payment on a villa that is in
 * fact taken — is far more expensive than a message that needs a human.
 */
@Injectable()
export class BookingOwnerReplyService {
  private readonly logger = new Logger(BookingOwnerReplyService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private bookingService: BookingService,
    private whatsappClientService: WhatsappClientService,
  ) {}

  async handleInboundMessage(
    payload: InboundMessageDto,
  ): Promise<OwnerReplyResult> {
    const phoneNumber = (payload?.phoneNumber ?? '').replace(/\D/g, '');
    const reply = parseOwnerReply(payload?.message ?? '');

    if (!phoneNumber || reply.intent === OwnerReplyIntent.Unknown) {
      // Guests message this number too, and owners chat like people. Anything
      // that is not a clear answer is simply left for the admin to read.
      return { outcome: OwnerReplyOutcome.Ignored };
    }

    const candidates = await this._findBookingsAwaitingOwner(phoneNumber);

    if (!candidates.length) {
      this.logger.log(
        `inbound reply from ${phoneNumber} matched no booking awaiting owner confirmation`,
      );

      return { outcome: OwnerReplyOutcome.NoPendingBooking };
    }

    const booking = this._resolveBooking(candidates, reply.bookingCode);

    if (!booking) {
      await this._sendToOwner(
        phoneNumber,
        buildOwnerReplyAmbiguousMessage(candidates),
        `ambiguous owner reply from ${phoneNumber}`,
      );

      return { outcome: OwnerReplyOutcome.Ambiguous };
    }

    return await this._applyReply(
      booking,
      phoneNumber,
      reply.intent === OwnerReplyIntent.Available,
    );
  }

  /**
   * Every booking still awaiting confirmation whose property belongs to the
   * owner on the other end of this phone number.
   *
   * Phone numbers are compared as bare digits, and a leading zero on the
   * national part is tolerated, because `+62` / `081…` and `+62` / `81…` are
   * both in the wild and WhatsApp only ever reports the fully-qualified form.
   */
  private async _findBookingsAwaitingOwner(
    phoneNumber: string,
  ): Promise<BookingWithRelationsDto[]> {
    const rows = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.villa', 'villa')
      .leftJoin('villa.owner', 'villaOwner')
      .leftJoin('booking.activity', 'activity')
      .leftJoin('activity.owner', 'activityOwner')
      .select(['booking.id'])
      .where('booking.status IN (:...statuses)', {
        statuses: AWAITING_OWNER_CONFIRMATION_STATUSES,
      })
      .andWhere(
        `(${this._ownerPhoneMatches('villaOwner')} OR ${this._ownerPhoneMatches(
          'activityOwner',
        )})`,
        { phoneNumber },
      )
      .orderBy('booking.createdAt', 'DESC')
      .getMany();

    // Re-read through the service so the acknowledgement messages get the same
    // fully-populated shape every other notification is built from.
    return await Promise.all(
      rows.map((row) => this.bookingService.findOne(row.id)),
    );
  }

  private _ownerPhoneMatches(alias: string): string {
    const countryCode = `regexp_replace(${alias}.phoneCountryCode, '[^0-9]', '', 'g')`;
    const nationalNumber = `regexp_replace(${alias}.phoneNumber, '[^0-9]', '', 'g')`;

    return `(${countryCode} || ${nationalNumber} = :phoneNumber OR ${countryCode} || regexp_replace(${nationalNumber}, '^0+', '') = :phoneNumber)`;
  }

  /**
   * Picks the booking the owner meant. A quoted code wins; a single waiting
   * booking is unambiguous on its own. A code that matches nothing is treated
   * as noise rather than an error — owners paste all sorts of things — and the
   * single-booking rule still applies.
   */
  private _resolveBooking(
    candidates: BookingWithRelationsDto[],
    bookingCode: string | null,
  ): BookingWithRelationsDto | null {
    if (bookingCode) {
      const wanted = bookingCode.toUpperCase();
      const matched = candidates.find(
        (candidate) => buildBookingCode(candidate.id) === wanted,
      );

      if (matched) {
        return matched;
      }

      this.logger.warn(
        `owner reply quoted booking code ${wanted}, which matches none of their ${candidates.length} waiting bookings`,
      );
    }

    return candidates.length === 1 ? candidates[0] : null;
  }

  /**
   * Moves the booking and tells the owner what happened.
   *
   * The status change goes through `BookingService.update` rather than the
   * repository so it takes the same path as an admin clicking in the dashboard:
   * transitions are validated, and the customer's WhatsApp message is emitted
   * by the usual status-changed listener.
   */
  private async _applyReply(
    booking: BookingWithRelationsDto,
    phoneNumber: string,
    available: boolean,
  ): Promise<OwnerReplyResult> {
    const nextStatus = this._resolveNextStatus(booking.type, available);

    if (!nextStatus || nextStatus === booking.status) {
      // An available activity is already sitting at `pending`, which is its
      // payable state — there is nothing to move, only to confirm.
      await this._sendToOwner(
        phoneNumber,
        buildOwnerReplyAcknowledgedMessage(booking, available),
        `owner reply acknowledgement for booking ${booking.id}`,
      );

      return {
        outcome: OwnerReplyOutcome.Acknowledged,
        bookingId: booking.id,
        status: booking.status,
      };
    }

    try {
      await this.bookingService.update(booking.id, {
        status: nextStatus,
        ...(available
          ? {}
          : { closedReason: 'owner reported the dates as unavailable' }),
      });
    } catch (error) {
      this.logger.error(
        `failed to apply owner reply to booking ${booking.id}: ${error.message}`,
      );

      return {
        outcome: OwnerReplyOutcome.Failed,
        bookingId: booking.id,
        reason: error.message,
      };
    }

    this.logger.log(
      `owner reply moved booking ${booking.id} from ${booking.status} to ${nextStatus}`,
    );

    await this._sendToOwner(
      phoneNumber,
      buildOwnerReplyAcknowledgedMessage(booking, available),
      `owner reply acknowledgement for booking ${booking.id}`,
    );

    return {
      outcome: OwnerReplyOutcome.Applied,
      bookingId: booking.id,
      status: nextStatus,
    };
  }

  /**
   * A villa moves to the payment step when free, and back into negotiation when
   * not — never straight to cancelled, so the admin can still offer the guest
   * another property without losing the enquiry.
   */
  private _resolveNextStatus(
    bookingType: BookingType,
    available: boolean,
  ): ActivityBookingStatus | VillaBookingStatus | null {
    if (bookingType === BookingType.Activity) {
      return available ? null : ActivityBookingStatus.Canceled;
    }

    return available
      ? VillaBookingStatus.WaitingForPayment
      : VillaBookingStatus.Negotiation;
  }

  private async _sendToOwner(
    phoneNumber: string,
    message: string,
    context: string,
  ): Promise<void> {
    try {
      await this.whatsappClientService.sendMessage({ phoneNumber, message });
    } catch (error) {
      // The booking has already moved; a failed courtesy reply must not undo it.
      this.logger.error(`failed to queue ${context}: ${error.message}`);
    }
  }
}
