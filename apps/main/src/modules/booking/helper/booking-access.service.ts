import { constructFrontendUrl } from '@apps/main/common/helpers';
import { Booking } from '@apps/main/database/entities';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, timingSafeEqual } from 'crypto';
import { EntityManager, Repository } from 'typeorm';
import { isClosedBookingStatus } from './booking-status.helper';

/** Hex characters — matches the varchar(64) column exactly. */
const ACCESS_TOKEN_BYTES = 32;

/** How long after the stay the link keeps working. */
const ACCESS_LIFETIME_DAYS_AFTER_STAY = 30;

/** Fallback lifetime when the booking has no date at all (defensive only). */
const ACCESS_FALLBACK_LIFETIME_DAYS = 90;

export interface BookingAccessContext {
  bookingId: string;
  accessExpiresAt: Date | null;
}

/**
 * Owns everything about the tokenised "book inform" link: the guest never logs
 * in, so this token is the entire authorisation story for their booking.
 */
@Injectable()
export class BookingAccessService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  generateAccessToken(): string {
    return randomBytes(ACCESS_TOKEN_BYTES).toString('hex');
  }

  /**
   * Links stay usable for a while after check-out so the guest can still open
   * their confirmation, then expire on their own.
   */
  resolveAccessExpiry(reference: {
    checkOutDate?: Date | string | null;
    bookingDate?: Date | string | null;
  }): Date {
    const anchor = reference.checkOutDate ?? reference.bookingDate;

    if (!anchor) {
      return this._addDays(new Date(), ACCESS_FALLBACK_LIFETIME_DAYS);
    }

    return this._addDays(new Date(anchor), ACCESS_LIFETIME_DAYS_AFTER_STAY);
  }

  buildBookingLink(accessToken: string): string {
    return `${constructFrontendUrl()}/booking/${accessToken}`;
  }

  /**
   * Looks up the link for an existing booking. Used by the notification
   * listeners, which only receive a booking id.
   */
  async findBookingLink(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<string | null> {
    const booking = await this._getRepository(entityManager).findOne({
      select: { id: true, accessToken: true },
      where: { id: bookingId },
    });

    return booking?.accessToken
      ? this.buildBookingLink(booking.accessToken)
      : null;
  }

  /**
   * Resolves a raw link token to a booking, rejecting closed and expired links.
   * Throws NotFound (never "invalid token") so an attacker cannot use the error
   * message to tell an existing booking from a wrong guess.
   */
  async resolveByAccessToken(
    accessToken: string,
    entityManager?: EntityManager,
  ): Promise<BookingAccessContext> {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new NotFoundException('booking not found');
    }

    const booking = await this._getRepository(entityManager).findOne({
      select: {
        id: true,
        status: true,
        accessToken: true,
        accessExpiresAt: true,
      },
      where: { accessToken },
    });

    if (!booking) {
      throw new NotFoundException('booking not found');
    }

    this._assertLinkStillOpen(booking);

    return { bookingId: booking.id, accessExpiresAt: booking.accessExpiresAt };
  }

  /**
   * Verifies a token against one specific booking — used by the guard that
   * protects the payment endpoints, where the booking id comes from the route.
   */
  async assertAccessToBooking(
    bookingId: string,
    accessToken: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (!bookingId || !accessToken || typeof accessToken !== 'string') {
      throw new NotFoundException('booking not found');
    }

    const booking = await this._getRepository(entityManager).findOne({
      select: {
        id: true,
        status: true,
        accessToken: true,
        accessExpiresAt: true,
      },
      where: { id: bookingId },
    });

    if (!booking || !booking.accessToken) {
      throw new NotFoundException('booking not found');
    }

    if (!this._tokensMatch(booking.accessToken, accessToken)) {
      throw new NotFoundException('booking not found');
    }

    this._assertLinkStillOpen(booking);
  }

  private _assertLinkStillOpen(booking: Booking): void {
    if (isClosedBookingStatus(booking.status)) {
      throw new ForbiddenException(
        'this booking has been closed and the link is no longer available',
      );
    }

    if (booking.accessExpiresAt && new Date(booking.accessExpiresAt) < new Date()) {
      throw new ForbiddenException('this booking link has expired');
    }
  }

  /**
   * Constant-time compare so response timing cannot be used to brute-force the
   * token one character at a time.
   */
  private _tokensMatch(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, 'utf8');
    const receivedBuffer = Buffer.from(received, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  }

  private _addDays(date: Date, days: number): Date {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
  }

  private _getRepository(entityManager?: EntityManager): Repository<Booking> {
    return entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;
  }
}
