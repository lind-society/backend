import {
  BookingPaymentRefund,
  BookingPaymentRefundStatus,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { BookingPaymentDto } from '../../dto/booking-payment.dto';

export interface IBookingPaymentRefundDto
  extends Omit<BookingPaymentRefund, 'currency' | 'bookingPayment'> {}

export interface IBookingPaymentRefundWithRelationsDto
  extends IBookingPaymentRefundDto {
  currency?: CurrencyDto;
  bookingPayment?: BookingPaymentDto;
}

export class BookingPaymentRefundDto implements IBookingPaymentRefundDto {
  readonly id!: string;
  readonly amount: number | null;
  readonly reason: string;
  readonly status: BookingPaymentRefundStatus;
  readonly failureReason: string | null;
  readonly currencyId: string;
  readonly bookingPaymentId: string;
  readonly paymentRefundRequestReferenceId: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingPaymentRefundWithRelationsDto
  extends BookingPaymentRefundDto
  implements IBookingPaymentRefundWithRelationsDto
{
  readonly currency?: CurrencyDto;
  readonly bookingPayment?: BookingPaymentDto;
}
