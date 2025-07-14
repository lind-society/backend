import {
  ActivityBookingStatus,
  Booking,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { BookingCustomerDto } from '@apps/main/modules/booking/customer/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';
import { ActivityDto } from '../../activity/dto';
import { BookingPaymentDto } from '../../booking-payment/dto';

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
  readonly type: BookingType;
  readonly totalGuest: number;
  readonly totalAmount: number;
  readonly bookingDate: Date;
  readonly checkInDate: Date;
  readonly checkOutDate: Date;
  readonly status: ActivityBookingStatus | VillaBookingStatus;
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
