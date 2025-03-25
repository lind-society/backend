import { BookingPayment } from 'src/database/entities';
import { CurrencyDto } from 'src/modules/currency/dto';
import { BookingDto } from '../../dto';

export interface IBookingPaymentDto
  extends Omit<BookingPayment, 'booking' | 'currency'> {}

export interface IBookingPaymentWithRelationsDto extends IBookingPaymentDto {
  booking?: BookingDto[];
  currency?: CurrencyDto[];
}

export class BookingPaymentDto implements IBookingPaymentDto {
  readonly id!: string;
  readonly paymentMethod!: string;
  readonly amount!: number;
  readonly status!: string;
  readonly currencyId: string;
  readonly bookingId: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingPaymentWithRelationsDto
  extends BookingPaymentDto
  implements IBookingPaymentWithRelationsDto
{
  readonly bookings?: BookingDto[];
  readonly currency?: CurrencyDto[];
}
