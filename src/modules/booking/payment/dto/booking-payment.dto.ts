import { BookingPayment } from 'src/database/entities';
import { ActivityBookingDto } from 'src/modules/activity/booking/dto';
import { CurrencyDto } from 'src/modules/currency/dto';
import { VillaBookingDto } from 'src/modules/villa/booking/dto';

export interface IBookingPaymentDto
  extends Omit<
    BookingPayment,
    'activityBooking' | 'villaBooking' | 'currency'
  > {}

export interface IBookingPaymentWithRelationsDto extends IBookingPaymentDto {
  villaBooking?: VillaBookingDto;
  activityBooking?: ActivityBookingDto;
  currency?: CurrencyDto;
}

export class BookingPaymentDto implements IBookingPaymentDto {
  readonly id!: string;
  readonly paymentMethod!: string;
  readonly amount!: number;
  readonly status!: string;
  readonly currencyId: string;
  readonly activityBookingId: string | null;
  readonly villaBookingId: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingPaymentWithRelationsDto
  extends BookingPaymentDto
  implements IBookingPaymentWithRelationsDto
{
  readonly activityBooking?: ActivityBookingDto;
  readonly villaBooking?: VillaBookingDto;
  readonly currency?: CurrencyDto;
}
