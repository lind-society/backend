import {
  BookingPayment,
  BookingPaymentAvailableStatus,
  BookingPaymentFailureStage,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { BookingDto } from '../../booking/dto';
import { BookingPaymentRefundDto } from '../refund/dto';

export interface IBookingPaymentDto
  extends Omit<BookingPayment, 'booking' | 'currency' | 'refundHistories'> {}

export interface IBookingPaymentWithRelationsDto extends IBookingPaymentDto {
  booking?: BookingDto;
  currency?: CurrencyDto;
  refundHistories?: BookingPaymentRefundDto[];
}

export class BookingPaymentDto implements IBookingPaymentDto {
  readonly id!: string;
  readonly paymentMethod!: string | null;
  readonly paymentChannel!: string | null;
  readonly amount!: number | null;
  readonly status!: BookingPaymentAvailableStatus | null;
  readonly failureStage: BookingPaymentFailureStage | null;
  readonly failureReason: string | null;
  readonly refundedAmount: number | null;
  readonly refundedReason: string | null;
  readonly cancelledReason: string | null;
  readonly paymentReferenceId!: string | null;
  readonly paymentRequestReferenceId!: string | null;
  readonly paymentSessionReferenceId!: string | null;
  readonly paymentTokenReferenceId!: string | null;
  readonly paymentRefundReferenceId!: string | null;
  readonly currencyId!: string;
  readonly bookingId!: string | null;
  readonly paidAt!: Date | null;
  readonly refundedAt!: Date | null;
  readonly cancelledAt!: Date | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingPaymentWithRelationsDto
  extends BookingPaymentDto
  implements IBookingPaymentWithRelationsDto
{
  readonly booking?: BookingDto;
  readonly currency?: CurrencyDto;
  readonly refundHistories?: BookingPaymentRefundDto[];
}
