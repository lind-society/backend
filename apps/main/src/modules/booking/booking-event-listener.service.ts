import {
  CANCEL_PAYMENT,
  CANCEL_PAYMENT_REQUEST,
  CANCEL_PAYMENT_SESSION,
  CAPTURE_PAYMENT,
  CHANGED_BOOKING_STATUS,
  CREATED_BOOKING,
  CREATED_PAYMENT_REFUND,
  CREATED_PAYMENT_REQUEST,
  CREATED_PAYMENT_SESSION,
  PAYMENT_REFUND_CALLBACK,
  PAYMENT_REQUEST_CALLBACK,
  PAYMENT_SESSION_CALLBACK,
  PAYMENT_TOKEN_CALLBACK,
} from '@apps/main/common/constants';
import { constructPhoneNumber } from '@apps/main/common/helpers';
import {
  ActivityBookingStatus,
  Booking,
  BookingPaymentAvailableStatus,
  BookingPaymentFailureStage,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { MailClientService } from '@libs/mail-client';
import { WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BookingPaymentService } from '../booking-payment/booking-payment.service';
import { BookingPaymentWithRelationsDto } from '../booking-payment/dto';
import { mapPaymentRefundStatus } from '../booking-payment/helper';
import { BookingPaymentRefundService } from '../booking-payment/refund/booking-payment-refund.service';
import {
  PaymentDto,
  PaymentRefundCallbackDto,
  PaymentRefundDto,
  PaymentRequestCallbackDto,
  PaymentRequestDto,
  PaymentSessionDto,
  PaymentTokenCallbackDto,
} from '../payment/dto';
import { PaymentSessionCallbackDto } from '../payment/dto/payment-session/payment-session-callback.dto';
import { PaymentAvailableRefundStatus } from '../payment/enum';
import {
  mapXenditToGenericPaymentAvailableStatus,
  mapXenditToGenericPaymentRequestAvailableStatus,
  mapXenditToGenericPaymentSessionAvailableStatus,
  mapXenditToGenericPaymentTokenAvailableStatus,
} from '../payment/strategies/xendit/helper/enum-mapper';
import { BookingService } from './booking.service';
import { BookingStatusChangedEventDto, BookingWithRelationsDto } from './dto';
import { BookingAccessService } from './helper/booking-access.service';
import {
  buildCustomerBookingClosedMessage,
  buildCustomerBookingConfirmedMessage,
  buildCustomerInquiryReceivedMessage,
  buildCustomerNegotiationMessage,
  buildCustomerPaymentReadyMessage,
  buildOwnerAvailabilityRequestMessage,
} from './helper/booking-message.helper';
import { buildBookingCode } from './helper/booking-owner-reply.parser';
import {
  PaymentSettlement,
  settlePaymentCallbackAmount,
} from './helper/payment-settlement.helper';
import { canTransitionBookingStatus } from './helper/booking-status.helper';

@Injectable()
export class BookingEventListenerService {
  private readonly logger = new Logger(BookingEventListenerService.name);

  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    private bookingService: BookingService,
    private bookingPaymentService: BookingPaymentService,
    private bookingPaymentRefundService: BookingPaymentRefundService,
    private whatsappClientService: WhatsappClientService,
    private mailClientService: MailClientService,
    private bookingAccessService: BookingAccessService,
  ) {}

  /**
   * A brand-new inquiry. Two messages go out from the admin's business number:
   * one to the guest acknowledging the request and handing them their link, and
   * one to the property owner asking them to confirm availability. Nothing here
   * is allowed to fail the booking itself.
   */
  @OnEvent(CREATED_BOOKING, { async: true })
  async handleCreatedBooking(id: string): Promise<void> {
    try {
      const bookingDetail = await this.bookingService.findOne(id);
      const bookingLink = await this.bookingAccessService.findBookingLink(id);

      const customerQueued = await this._sendWhatsapp(
        this._customerPhoneNumber(bookingDetail),
        buildCustomerInquiryReceivedMessage(bookingDetail, bookingLink ?? ''),
        `inquiry acknowledgement for booking ${id}`,
      );

      const ownerQueued = await this._sendWhatsapp(
        this._ownerPhoneNumber(bookingDetail),
        buildOwnerAvailabilityRequestMessage(bookingDetail),
        `owner availability request for booking ${id}`,
      );

      await this._stampNotificationAttempts(id, customerQueued, ownerQueued);
    } catch (error) {
      this.logger.error(
        `failed to process created booking notification for ${id}: ${error.message}`,
      );
    }
  }

  /**
   * Drives every customer-facing message after the inquiry: the payment link
   * once the admin confirms availability, the confirmation once the gateway
   * reports the money in, and the closing notice when a negotiation ends.
   *
   * Statuses are read from the event payload rather than the database, because
   * this runs while the transaction that changed them may still be open.
   */
  @OnEvent(CHANGED_BOOKING_STATUS, { async: true })
  async handleChangedBookingStatus(
    payload: BookingStatusChangedEventDto,
  ): Promise<void> {
    try {
      const bookingDetail = await this.bookingService.findOne(payload.bookingId);
      const bookingLink = await this.bookingAccessService.findBookingLink(
        payload.bookingId,
      );
      const phoneNumber = this._customerPhoneNumber(bookingDetail);

      switch (payload.currentStatus) {
        case VillaBookingStatus.WaitingForPayment:
          await this._sendWhatsapp(
            phoneNumber,
            buildCustomerPaymentReadyMessage(bookingDetail, bookingLink ?? ''),
            `payment link for booking ${payload.bookingId}`,
          );
          break;

        case VillaBookingStatus.Booked:
        case ActivityBookingStatus.Confirmed:
          await this._sendWhatsapp(
            phoneNumber,
            buildCustomerBookingConfirmedMessage(
              bookingDetail,
              bookingLink ?? '',
            ),
            `booking confirmation for booking ${payload.bookingId}`,
          );
          await this._sendBookingConfirmationMail(
            bookingDetail,
            bookingLink ?? '',
          );
          break;

        // Reached when the owner reports the dates as taken. The guest is told
        // straight away rather than being left waiting on a link that will
        // never turn into a payment.
        case VillaBookingStatus.Negotiation:
          await this._sendWhatsapp(
            phoneNumber,
            buildCustomerNegotiationMessage(bookingDetail, bookingLink ?? ''),
            `alternative-search notice for booking ${payload.bookingId}`,
          );
          break;

        case VillaBookingStatus.Canceled:
          await this._sendWhatsapp(
            phoneNumber,
            buildCustomerBookingClosedMessage(
              bookingDetail,
              payload.closedReason,
            ),
            `booking closure notice for booking ${payload.bookingId}`,
          );
          break;

        default:
          this.logger.log(
            `booking ${payload.bookingId} moved to ${payload.currentStatus}, no customer notification configured`,
          );
      }
    } catch (error) {
      this.logger.error(
        `failed to notify status change for booking ${payload.bookingId}: ${error.message}`,
      );
    }
  }

  // Payment Gateway Event Listener

  // Payment Request
  @OnEvent(CREATED_PAYMENT_REQUEST, { async: true })
  async handleCreateBookingPaymentRequest(
    payload: PaymentRequestDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.requestAmount,
            status: mapXenditToGenericPaymentRequestAvailableStatus(
              payload.status,
            ),
            paymentMethod: payload.channelCode,
            paymentChannel: payload.channelCode,
            paymentRequestReferenceId: payload.paymentRequestId,
            failureReason: payload.failureCode,
            failureStage: payload.failureCode
              ? BookingPaymentFailureStage.CreatePaymentRequest
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `created booking payment with id ${bookingPayment.id} request for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(CANCEL_PAYMENT_REQUEST, { async: true })
  async handleCancelBookingPaymentRequest(
    payload: PaymentRequestDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.requestAmount,
            status: mapXenditToGenericPaymentRequestAvailableStatus(
              payload.status,
            ),
            paymentMethod: payload.channelCode,
            paymentChannel: payload.channelCode,
            paymentRequestReferenceId: payload.paymentRequestId,
            failureReason: payload.failureCode,
            failureStage: payload.failureCode
              ? BookingPaymentFailureStage.CreatePaymentRequest
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `cancelled booking payment with id ${bookingPayment.id} request for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(PAYMENT_REQUEST_CALLBACK, { async: true })
  async handleBookingPaymentRequestCallback(
    payload: PaymentRequestCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPaymentId = this._getBookingPaymentId(
        payload.data.referenceId,
      );

      const stored = await this.bookingPaymentService.findOneFromDashboard(
        bookingPaymentId,
        manager,
      );

      const settlement = this._settleCallbackAmount(
        stored,
        payload.data.requestAmount,
        mapXenditToGenericPaymentRequestAvailableStatus(payload.data.status),
      );

      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          bookingPaymentId,
          {
            // `amount` is deliberately not written back from the callback: it
            // is what we asked the guest to pay, decided here, and a webhook
            // must never be able to redefine the price of a booking.
            status: settlement.status,
            paymentMethod: payload.data.channelCode,
            paymentChannel: payload.data.channelCode,
            paidAt: settlement.paidAt,
            paymentReferenceId: payload.data.paymentId,
            paymentRequestReferenceId: payload.data.paymentRequestId,
            failureReason: settlement.failureReason ?? payload.data.failureCode,
            failureStage:
              settlement.failureReason || payload.data.failureCode
                ? BookingPaymentFailureStage.PayPaymentRequest
                : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `updated booking ${bookingPayment.bookingId}, current booking status : ${bookingPayment.booking.status}`,
      );

      this.logger.log(
        `updated booking payment ${bookingPayment.id}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  // Payment Session
  @OnEvent(CREATED_PAYMENT_SESSION, { async: true })
  async handleCreateBookingPaymentSession(
    payload: PaymentSessionDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.amount,
            status: mapXenditToGenericPaymentSessionAvailableStatus(
              payload.status,
            ),
            paymentMethod: 'card',
            paymentChannel: 'card',
            paymentSessionReferenceId: payload.paymentSessionId,
            paymentTokenReferenceId: payload.paymentTokenId,
            paymentRequestReferenceId: payload.paymentRequestId,
            paymentReferenceId: payload.paymentId,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `card payment : created booking payment with id ${bookingPayment.id} request for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(CANCEL_PAYMENT_SESSION, { async: true })
  async handleCancelBookingPaymentSession(
    payload: PaymentSessionDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.amount,
            status: mapXenditToGenericPaymentSessionAvailableStatus(
              payload.status,
            ),
            paymentMethod: 'card',
            paymentChannel: 'card',
            paymentSessionReferenceId: payload.paymentSessionId,
            paymentTokenReferenceId: payload.paymentTokenId,
            paymentRequestReferenceId: payload.paymentRequestId,
            paymentReferenceId: payload.paymentId,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `card payment : cancel booking payment with id ${bookingPayment.id} request for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(PAYMENT_SESSION_CALLBACK, { async: true })
  async handleBookingPaymentSessionCallback(
    payload: PaymentSessionCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPaymentId = this._getBookingPaymentId(
        payload.data.referenceId,
      );

      const stored = await this.bookingPaymentService.findOneFromDashboard(
        bookingPaymentId,
        manager,
      );

      const settlement = this._settleCallbackAmount(
        stored,
        payload.data.amount,
        mapXenditToGenericPaymentSessionAvailableStatus(payload.data.status),
      );

      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          bookingPaymentId,
          {
            status: settlement.status,
            paymentMethod: 'card',
            paymentChannel: 'card',
            paidAt: settlement.paidAt,
            paymentReferenceId: payload.data.paymentId,
            paymentRequestReferenceId: payload.data.paymentRequestId,
            paymentSessionReferenceId: payload.data.paymentSessionId,
            paymentTokenReferenceId: payload.data.paymentTokenId,
            failureReason: settlement.failureReason,
            failureStage: settlement.failureReason
              ? BookingPaymentFailureStage.PayPaymentSession
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `updated booking ${bookingPayment.bookingId}, current booking status : ${bookingPayment.booking.status}`,
      );

      this.logger.log(
        `updated booking payment ${bookingPayment.id}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  // Refund
  @OnEvent(CREATED_PAYMENT_REFUND, { async: true })
  async handleCreateBookingPaymentRefund(
    payload: PaymentRefundDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            status: BookingPaymentAvailableStatus.WaitingForRefund,
            failureReason: payload.failureCode,
            failureStage: payload.failureCode
              ? BookingPaymentFailureStage.PaymentRefundRequest
              : null,
          },
          manager,
        );

      await this.bookingPaymentRefundService.create(
        {
          reason: payload.reason,
          bookingPaymentId: bookingPayment.id,
          paymentRefundRequestReferenceId: payload.id,
          currencyId: bookingPayment.currencyId,
          amount: payload.amount ?? bookingPayment.amount,
          status: mapPaymentRefundStatus(payload.status),
          failureReason: payload.failureCode,
        },
        true,
        null,
        manager,
      );

      this.logger.log(
        `initiate payment refund for booking payment ${bookingPayment.booking.id}`,
      );
    });
  }

  @OnEvent(PAYMENT_REFUND_CALLBACK, { async: true })
  async handleBookingPaymentRefundCallback(
    payload: PaymentRefundCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      // The gateway retries this webhook until it gets a 2xx, and can redeliver
      // one it has already delivered. `refundedAmount` accumulates below, so a
      // second pass over the same refund would book the money twice.
      const alreadyRecorded =
        await this.bookingPaymentRefundService.findByGatewayReferenceId(
          payload.data.id,
          manager,
        );

      if (alreadyRecorded) {
        this.logger.log(
          `ignored duplicate refund callback for gateway refund ${payload.data.id}`,
        );

        return;
      }

      const initialBookingPayment =
        await this.bookingPaymentService.findOneFromDashboard(
          this._getBookingPaymentId(payload.data.referenceId),
          manager,
        );

      await this.bookingPaymentRefundService.create(
        {
          reason: payload.data.reason,
          bookingPaymentId: initialBookingPayment.id,
          paymentRefundRequestReferenceId: payload.data.id,
          currencyId: initialBookingPayment.currencyId,
          amount: payload.data.amount,
          status: mapPaymentRefundStatus(payload.data.status),
          failureReason: payload.data.failureCode,
        },
        true,
        null,
        manager,
      );

      if (payload.data.status === PaymentAvailableRefundStatus.Succeeded) {
        const bookingPayment =
          await this.bookingPaymentService.updateFromDashboard(
            this._getBookingPaymentId(payload.data.referenceId),
            {
              status: BookingPaymentAvailableStatus.Refunded,
              refundedAmount: initialBookingPayment.refundedAmount
                ? initialBookingPayment.refundedAmount + payload.data.amount
                : payload.data.amount,
              refundedReason: payload.data.reason,
              paymentRefundReferenceId: payload.data.id,
              failureReason: payload.data.failureCode,
              failureStage: payload.data.failureCode
                ? BookingPaymentFailureStage.PaymentRefundResult
                : null,
            },
            manager,
          );

        await this._updateBookingStatusIfAllowed(
          bookingPayment.bookingId,
          bookingPayment.booking.type,
          bookingPayment.booking.status,
          bookingPayment.booking.type === BookingType.Activity
            ? ActivityBookingStatus.Canceled
            : VillaBookingStatus.Canceled,
          manager,
        );

        this.logger.log(
          `payment refunded for booking ${bookingPayment.booking.id} with booking payment id ${bookingPayment.id}`,
        );

        this.logger.log(
          `current booking status : ${bookingPayment.booking.status}`,
        );

        this.logger.log(
          `current booking payment status : ${bookingPayment.status}`,
        );
      } else {
        const bookingPayment =
          await this.bookingPaymentService.updateFromDashboard(
            this._getBookingPaymentId(payload.data.referenceId),
            {
              status: BookingPaymentAvailableStatus.Paid,
              paymentRefundReferenceId: payload.data.id,
              failureReason: payload.data.failureCode,
              failureStage: payload.data.failureCode
                ? BookingPaymentFailureStage.PaymentRefundResult
                : null,
            },
            manager,
          );

        this.logger.log(
          `payment refund request for booking ${bookingPayment.booking.id} with booking payment id ${bookingPayment.id}`,
        );

        this.logger.log(
          `current booking status : ${bookingPayment.booking.status}`,
        );

        this.logger.log(
          `current booking payment status : ${bookingPayment.status}`,
        );
      }
    });
  }

  // Payment
  @OnEvent(CANCEL_PAYMENT, { async: true })
  async handleCancelBookingPayment(payload: PaymentDto): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.requestAmount,
            status: mapXenditToGenericPaymentAvailableStatus(payload.status),
            paymentMethod: payload.channelCode,
            paymentChannel: payload.channelCode,
            paymentReferenceId: payload.paymentId,
            paymentTokenReferenceId: payload.paymentTokenId,
            paymentRequestReferenceId: payload.paymentRequestId,
            failureReason: payload.failureCode,
            failureStage: payload.failureCode
              ? BookingPaymentFailureStage.CreatePaymentRequest
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `canceled booking payment with id ${bookingPayment.id} for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(CAPTURE_PAYMENT, { async: true })
  async handleCaptureBookingPayment(payload: PaymentDto): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.referenceId),
          {
            amount: payload.requestAmount,
            status: mapXenditToGenericPaymentAvailableStatus(payload.status),
            paymentMethod: payload.channelCode,
            paymentChannel: payload.channelCode,
            paymentReferenceId: payload.paymentId,
            paymentTokenReferenceId: payload.paymentTokenId,
            paymentRequestReferenceId: payload.paymentRequestId,
            failureReason: payload.failureCode,
            failureStage: payload.failureCode
              ? BookingPaymentFailureStage.CreatePaymentRequest
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `captured booking payment with id ${bookingPayment.id} for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  // Payment Token
  @OnEvent(PAYMENT_TOKEN_CALLBACK, { async: true })
  async handleBookingPaymentTokenCallback(
    payload: PaymentTokenCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.data.referenceId),
          {
            paymentTokenReferenceId: payload.data.paymentTokenId,
            status: mapXenditToGenericPaymentTokenAvailableStatus(
              payload.data.status,
            ),
            paymentMethod: payload.data.channelCode,
            paymentChannel: payload.data.channelCode,
            paidAt: new Date(),
            failureReason: payload.data.failureCode,
            failureStage: payload.data.failureCode
              ? BookingPaymentFailureStage.PaymentTokenActivation
              : null,
          },
          manager,
        );

      await this._syncBookingStatusWithPayment(bookingPayment, manager);

      this.logger.log(
        `updated booking ${bookingPayment.bookingId}, current booking status : ${bookingPayment.booking.status}`,
      );

      this.logger.log(
        `updated booking payment ${bookingPayment.id}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  // Private helper methods

  /**
   * Reconciles a callback amount against what we billed, and says so in the log
   * — a held payment is a booking a guest believes they paid for, so it needs
   * to be visible rather than silently parked.
   */
  private _settleCallbackAmount(
    stored: BookingPaymentWithRelationsDto,
    reportedAmount: number | null | undefined,
    mappedStatus: BookingPaymentAvailableStatus,
  ): PaymentSettlement {
    const settlement = settlePaymentCallbackAmount(
      stored.amount,
      reportedAmount,
      mappedStatus,
    );

    if (settlement.held) {
      this.logger.error(
        `booking payment ${stored.id} held for review — ${settlement.failureReason}; booking not confirmed`,
      );
    }

    if (settlement.overpaid) {
      this.logger.warn(
        `overpayment on booking payment ${stored.id}: expected ${stored.amount}, gateway reported ${reportedAmount} — confirming and flagging for refund`,
      );
    }

    return settlement;
  }

  /**
   * Mirrors a payment status onto its booking.
   *
   * Gateway callbacks are delivered at-least-once and can arrive out of order,
   * so a mapped status that would move the booking backwards (a stale "pending"
   * landing after "paid") is dropped instead of raising — a webhook must never
   * fail over a status it cannot apply.
   */
  private async _syncBookingStatusWithPayment(
    bookingPayment: BookingPaymentWithRelationsDto,
    manager: EntityManager,
  ): Promise<void> {
    await this._updateBookingStatusIfAllowed(
      bookingPayment.bookingId,
      bookingPayment.booking.type,
      bookingPayment.booking.status,
      this._mapBookingPaymentStatusToBookingStatus(
        bookingPayment.booking.type,
        bookingPayment.status,
      ),
      manager,
    );
  }

  private async _updateBookingStatusIfAllowed(
    bookingId: string,
    bookingType: BookingType,
    currentStatus: ActivityBookingStatus | VillaBookingStatus,
    nextStatus: ActivityBookingStatus | VillaBookingStatus,
    manager: EntityManager,
  ): Promise<void> {
    if (currentStatus === nextStatus) {
      return;
    }

    if (!canTransitionBookingStatus(bookingType, currentStatus, nextStatus)) {
      this.logger.warn(
        `ignored payment-driven status change for booking ${bookingId}: ${currentStatus} -> ${nextStatus} is not a valid transition`,
      );

      return;
    }

    await this.bookingService.update(
      bookingId,
      { status: nextStatus },
      manager,
    );
  }

  private _customerPhoneNumber(booking: BookingWithRelationsDto): string {
    return constructPhoneNumber(
      booking.customer?.phoneCountryCode,
      booking.customer?.phoneNumber,
    );
  }

  private _ownerPhoneNumber(booking: BookingWithRelationsDto): string {
    const owner =
      booking.type === BookingType.Activity
        ? booking.activity?.owner
        : booking.villa?.owner;

    return constructPhoneNumber(owner?.phoneCountryCode, owner?.phoneNumber);
  }

  /**
   * Hands a message to the WhatsApp microservice.
   *
   * Returns whether the message was *accepted for delivery*, not whether it was
   * delivered: the client dispatches in the background and retries through its
   * own queue. A failure here is logged and swallowed — no notification is ever
   * worth failing a booking or a payment callback over.
   */
  private async _sendWhatsapp(
    phoneNumber: string,
    message: string,
    context: string,
  ): Promise<boolean> {
    if (!phoneNumber) {
      this.logger.warn(`skipped ${context}: no phone number on record`);

      return false;
    }

    try {
      await this.whatsappClientService.sendMessage({ phoneNumber, message });

      this.logger.log(`queued ${context} to ${phoneNumber}`);

      return true;
    } catch (error) {
      this.logger.error(`failed to queue ${context}: ${error.message}`);

      return false;
    }
  }

  private async _sendBookingConfirmationMail(
    booking: BookingWithRelationsDto,
    bookingLink: string,
  ): Promise<void> {
    if (!booking.customer?.email) {
      this.logger.warn(
        `skipped confirmation email for booking ${booking.id}: no email on record`,
      );

      return;
    }

    try {
      await this.mailClientService.sendMail({
        to: booking.customer.email,
        subject: 'Your booking is confirmed',
        template: 'booking',
        context: {
          username: booking.customer.name,
          bookingType: booking.type,
          propertyName:
            booking.type === BookingType.Activity
              ? booking.activity?.name
              : booking.villa?.name,
          totalGuest: booking.totalGuest,
          totalAmount: Number(booking.totalAmount).toLocaleString('id-ID'),
          currencySymbol: booking.currency?.symbol ?? '',
          bookingDate: booking.bookingDate,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          // The same reference the owner and our team quote on WhatsApp, and
          // the same single link the guest has had since the inquiry.
          bookingCode: buildBookingCode(booking.id),
          bookingLink,
        },
        source: 'booking-confirmation',
      });
    } catch (error) {
      this.logger.error(
        `failed to queue confirmation email for booking ${booking.id}: ${error.message}`,
      );
    }
  }

  /**
   * Records that the automatic messages were dispatched. Only safe on the
   * created-booking path, which runs after its transaction has committed —
   * writing to `bookings` from a listener that a still-open transaction is
   * awaiting would deadlock on the same row.
   */
  private async _stampNotificationAttempts(
    bookingId: string,
    customerQueued: boolean,
    ownerQueued: boolean,
  ): Promise<void> {
    if (!customerQueued && !ownerQueued) {
      return;
    }

    const now = new Date();

    try {
      await this.datasource.getRepository(Booking).update(bookingId, {
        ...(customerQueued ? { customerNotifiedAt: now } : {}),
        ...(ownerQueued ? { ownerNotifiedAt: now } : {}),
      });
    } catch (error) {
      this.logger.error(
        `failed to stamp notification timestamps for booking ${bookingId}: ${error.message}`,
      );
    }
  }

  private _mapBookingPaymentStatusToBookingStatus(
    bookingType: BookingType,
    paymentStatus: BookingPaymentAvailableStatus,
  ): ActivityBookingStatus | VillaBookingStatus {
    const isActivity = bookingType === BookingType.Activity;

    switch (paymentStatus) {
      case BookingPaymentAvailableStatus.RequiresAction:
      case BookingPaymentAvailableStatus.Active:
      case BookingPaymentAvailableStatus.Authorized:
      case BookingPaymentAvailableStatus.Pending:
      case BookingPaymentAvailableStatus.Expired:
      case BookingPaymentAvailableStatus.Failed:
        return isActivity
          ? ActivityBookingStatus.Pending
          : VillaBookingStatus.WaitingForPayment;

      case BookingPaymentAvailableStatus.Paid:
        return isActivity
          ? ActivityBookingStatus.Confirmed
          : VillaBookingStatus.Booked;

      case BookingPaymentAvailableStatus.Canceled:
        return isActivity
          ? ActivityBookingStatus.Canceled
          : VillaBookingStatus.Canceled;

      default:
        return isActivity
          ? ActivityBookingStatus.Pending
          : VillaBookingStatus.WaitingForPayment;
    }
  }

  private _getBookingPaymentId(paymentReferenceId: string): string {
    return paymentReferenceId.split('_')[0];
  }
}
