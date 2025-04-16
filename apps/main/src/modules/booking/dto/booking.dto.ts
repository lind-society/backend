import { Booking, BookingStatus } from '@apps/main/database/entities';
import { ActivityDto } from '@apps/main/modules/activity/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';
import { BookingCustomerDto } from '../customer/dto';
import { BookingPaymentDto } from '../payment/dto';

export interface IBookingDto
  extends Omit<
    Booking,
    'payments' | 'currency' | 'customer' | 'activity' | 'villa'
  > {}

export interface IBookingWithRelationsDto extends IBookingDto {
  currency?: CurrencyDto;
  customer?: BookingCustomerDto;
  payments?: BookingPaymentDto[];
  activity?: ActivityDto;
  villa?: VillaDto;
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
  readonly activityId: string | null;
  readonly villaId: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingWithRelationsDto
  extends BookingDto
  implements IBookingWithRelationsDto
{
  readonly currency?: CurrencyDto;
  readonly customer?: BookingCustomerDto;
  readonly payments?: BookingPaymentDto[];
  readonly activity?: ActivityDto;
  readonly villa?: VillaDto;
}
