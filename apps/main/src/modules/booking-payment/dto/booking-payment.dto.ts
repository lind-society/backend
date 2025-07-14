import {
  BookingPayment,
  BookingPaymentStatus,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { BookingDto } from '../../booking/dto';

export interface IBookingPaymentDto
  extends Omit<BookingPayment, 'booking' | 'currency'> {}

export interface IBookingPaymentWithRelationsDto extends IBookingPaymentDto {
  booking?: BookingDto;
  currency?: CurrencyDto;
}

export class BookingPaymentDto implements IBookingPaymentDto {
  readonly id!: string;
  readonly paymentMethod!: string | null;
  readonly paymentChannel!: string | null;
  readonly amount!: number | null;
  readonly status!: BookingPaymentStatus | null;
  readonly paymentReferenceId!: string | null;
  readonly currencyId!: string;
  readonly bookingId!: string | null;
  readonly paidAt!: Date | null;
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
}
