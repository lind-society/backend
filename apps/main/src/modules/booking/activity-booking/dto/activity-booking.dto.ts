import {
  ActivityBooking,
  ActivityBookingStatus,
} from '@apps/main/database/entities';
import { ActivityDto } from '@apps/main/modules/activity/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { ReviewDto } from '@apps/main/modules/review/dto';
import { BookingCustomerDto } from '../../customer/dto';
import { BookingPaymentDto } from '../../payment/dto';

export interface IActivityBookingDto
  extends Omit<
    ActivityBooking,
    'activity' | 'currency' | 'customer' | 'payments' | 'review'
  > {}

export interface IActivityBookingWithRelationsDto extends IActivityBookingDto {
  activity?: ActivityDto;
  currency?: CurrencyDto;
  customer?: BookingCustomerDto;
  payments?: BookingPaymentDto[];
  review?: ReviewDto;
}

export class ActivityBookingDto implements IActivityBookingDto {
  readonly id!: string;
  readonly totalGuest: number;
  readonly totalAmount: number;
  readonly bookingDate: Date;
  readonly status: ActivityBookingStatus;
  readonly currencyId!: string;
  readonly customerId!: string;
  readonly activityId: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ActivityBookingWithRelationsDto
  extends ActivityBookingDto
  implements IActivityBookingWithRelationsDto
{
  readonly activity?: ActivityDto;
  readonly currency?: CurrencyDto;
  readonly customer?: BookingCustomerDto;
  readonly payments?: BookingPaymentDto[];
  readonly review?: ReviewDto;
}
