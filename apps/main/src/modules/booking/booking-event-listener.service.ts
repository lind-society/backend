import {
  CREATED_BOOKING,
  PAYMENT_REQUEST_CALLBACK,
} from '@apps/main/common/constants';
import { constructPhoneNumber } from '@apps/main/common/helpers';
import {
  ActivityBookingStatus,
  BookingPaymentAvailableStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BookingPaymentService } from '../booking-payment/booking-payment.service';
import { PaymentRequestCallbackDto } from '../payment/dto';
import { mapXenditToGenericPaymentRequestAvailableStatus } from '../payment/strategies/xendit/helper/enum-mapper';
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
    private whatsappClientService: WhatsappClientService,
  ) {}

  @OnEvent(PAYMENT_REQUEST_CALLBACK, { async: true })
  async handleUpdateBookingPayment(
    payload: PaymentRequestCallbackDto,
  ): Promise<void> {
    await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment = await this.bookingPaymentService.update(
        payload.data.referenceId,
        {
          amount: payload.data.requestAmount,
          status: mapXenditToGenericPaymentRequestAvailableStatus(
            payload.data.status,
          ),
          paymentChannel: payload.data.channelCode,
          paymentMethod: payload.data.channelCode,
          failureReason: payload.data.failureCode,
          paidAt: payload.data.updated,
          paymentReferenceId: payload.data.referenceId,
        },
        true,
        null,
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
        `booking for ${bookingPayment.booking.id} ${payload.data.status}`,
      );

      return bookingPayment;
    });
  }

  @OnEvent(CREATED_BOOKING, { async: true })
  async handleCreatedBooking(id: string): Promise<void> {
    const bookingDetail = await this.bookingService.findOne(id);

    await this._sendWhatsappActivityBookingHelper(bookingDetail);
  }

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

  // Villa
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

  // Both
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
}
