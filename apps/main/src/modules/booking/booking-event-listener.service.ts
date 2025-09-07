import {
  CANCEL_PAYMENT,
  CANCEL_PAYMENT_REQUEST,
  CANCEL_PAYMENT_SESSION,
  CAPTURE_PAYMENT,
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
  BookingPaymentAvailableStatus,
  BookingPaymentFailureStage,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BookingPaymentService } from '../booking-payment/booking-payment.service';
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
import { PaymentAvailableRefundStatus } from '../payment/enum';
import {
  mapXenditToGenericPaymentAvailableStatus,
  mapXenditToGenericPaymentRequestAvailableStatus,
  mapXenditToGenericPaymentSessionAvailableStatus,
  mapXenditToGenericPaymentTokenAvailableStatus,
} from '../payment/strategies/xendit/helper/enum-mapper';
import { BookingService } from './booking.service';
import { BookingWithRelationsDto } from './dto';

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
  ) {}

  @OnEvent(CREATED_BOOKING, { async: true })
  async handleCreatedBooking(id: string): Promise<void> {
    const bookingDetail = await this.bookingService.findOne(id);

    await this._sendWhatsappActivityBookingHelper(bookingDetail);
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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.data.referenceId),
          {
            amount: payload.data.requestAmount,
            status: mapXenditToGenericPaymentRequestAvailableStatus(
              payload.data.status,
            ),
            paymentMethod: payload.data.channelCode,
            paymentChannel: payload.data.channelCode,
            paidAt: new Date(),
            paymentReferenceId: payload.data.paymentId,
            paymentRequestReferenceId: payload.data.paymentRequestId,
            failureReason: payload.data.failureCode,
            failureStage: payload.data.failureCode
              ? BookingPaymentFailureStage.PayPaymentRequest
              : null,
          },
          manager,
        );

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

      this.logger.log(
        `card payment : cancel booking payment with id ${bookingPayment.id} request for booking ${bookingPayment.booking.id}, current booking status : ${bookingPayment.booking.status}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  @OnEvent(PAYMENT_SESSION_CALLBACK, { async: true })
  async handleBookingPaymentSessionCallback(
    payload: PaymentRequestCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment =
        await this.bookingPaymentService.updateFromDashboard(
          this._getBookingPaymentId(payload.data.referenceId),
          {
            amount: payload.data.requestAmount,
            status: mapXenditToGenericPaymentRequestAvailableStatus(
              payload.data.status,
            ),
            paymentMethod: payload.data.channelCode,
            paymentChannel: payload.data.channelCode,
            paidAt: new Date(),
            paymentReferenceId: payload.data.paymentId,
            paymentRequestReferenceId: payload.data.paymentRequestId,
            failureReason: payload.data.failureCode,
            failureStage: payload.data.failureCode
              ? BookingPaymentFailureStage.PayPaymentSession
              : null,
          },
          manager,
        );

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

        await this.bookingService.update(
          bookingPayment.bookingId,
          {
            status:
              bookingPayment.booking.type === BookingType.Activity
                ? ActivityBookingStatus.Canceled
                : VillaBookingStatus.Canceled,
          },
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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

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

      await this.bookingService.update(
        bookingPayment.bookingId,
        {
          status: this._mapBookingPaymentStatusToBookingStatus(
            bookingPayment.booking.type,
            bookingPayment.status,
          ),
        },
        manager,
      );

      this.logger.log(
        `updated booking ${bookingPayment.bookingId}, current booking status : ${bookingPayment.booking.status}`,
      );

      this.logger.log(
        `updated booking payment ${bookingPayment.id}, current booking payment status : ${bookingPayment.status}`,
      );
    });
  }

  // Private helper methods
  private _formatActivityBookingMessage(
    booking: BookingWithRelationsDto,
  ): string {
    const bookingDate = new Date(booking.bookingDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    return `Thank you ${booking.customer.name} for booking with us at ${booking.activity?.name}!
      
    🏡 *Activity*: ${booking.activity?.name} (${booking.activity?.secondaryName || '-'})
    📍 *Address*: ${booking.activity?.address}, ${booking.activity?.city}, ${booking.activity?.state}, ${booking.activity?.country}
    🗓️ *Booking Date*: ${bookingDate} WIB
    👥 *Total Guests*: ${booking.totalGuest}
    💵 *Total Amount*: ${booking.currency?.symbol || ''} ${Number(booking.totalAmount).toLocaleString('id-ID')}
    🗺️ *Map*: ${booking.activity?.mapLink || '-'}
      
    We look forward to welcoming you!`;
  }

  private _formatVillaBookingMessage(booking: BookingWithRelationsDto): string {
    const checkInDate = new Date(booking.checkInDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
    const checkOutDate = new Date(booking.checkOutDate).toLocaleString(
      'en-GB',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      },
    );

    return `Thank you ${booking.customer.name} for booking with us at ${booking.villa?.name}!
  
🏡 *Villa*: ${booking.villa?.name} (${booking.villa?.secondaryName || '-'})
📍 *Address*: ${booking.villa?.address}, ${booking.villa?.city}, ${booking.villa?.state}, ${booking.villa?.country}
🗓️ *Check-in*: ${checkInDate} WIB
🗓️ *Check-out*: ${checkOutDate} WIB
👥 *Total Guests*: ${booking.totalGuest}
💵 *Total Amount*: ${booking.currency?.symbol || ''} ${Number(booking.totalAmount).toLocaleString('id-ID')}
🗺️ *Map*: ${booking.villa?.mapLink || '-'}
  
We look forward to welcoming you!`;
  }

  private _formatBookingMessage(
    bookingDetail: BookingWithRelationsDto,
  ): string {
    switch (bookingDetail.type) {
      case BookingType.Activity:
        return this._formatActivityBookingMessage(bookingDetail);

      case BookingType.Villa:
        return this._formatVillaBookingMessage(bookingDetail);

      default:
        return '';
    }
  }

  private async _sendWhatsappActivityBookingHelper(
    bookingDetail: BookingWithRelationsDto,
  ) {
    const constructedPhoneNumber = constructPhoneNumber(
      bookingDetail.customer.phoneCountryCode,
      bookingDetail.customer.phoneNumber,
    );

    try {
      await this.whatsappClientService.sendMessage({
        phoneNumber: constructedPhoneNumber,
        message: this._formatBookingMessage(bookingDetail),
      });
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message:', error.message);
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
