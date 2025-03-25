import { Booking, BookingStatus } from 'src/database/entities';
import { CurrencyDto } from 'src/modules/currency/dto';
import { BookingCustomerDto } from '../customer/dto';
import { BookingPaymentDto } from '../payment/dto';

export interface IBookingDto
  extends Omit<Booking, 'payments' | 'currency' | 'customer'> {}

export interface IBookingWithRelationsDto extends IBookingDto {
  payments?: BookingPaymentDto[];
  currency?: CurrencyDto[];
  customer?: BookingCustomerDto[];
}

export class BookingDto implements IBookingDto {
  readonly id!: string;
  readonly totalGuest: number;
  readonly totalAmount: number;
  readonly checkInDate: Date;
  readonly checkOutDate: Date;
  readonly status: BookingStatus;
  readonly currencyId!: string;
  readonly customerId!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingWithRelationsDto
  extends BookingDto
  implements IBookingWithRelationsDto
{
  readonly payments?: BookingPaymentDto[];
  readonly currency?: CurrencyDto[];
  readonly customer?: BookingCustomerDto[];
}
