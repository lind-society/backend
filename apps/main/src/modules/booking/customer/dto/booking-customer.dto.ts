import { BookingCustomer } from '@apps/main/database/entities';
import { ActivityBookingDto } from '@apps/main/modules/booking/activity-booking/dto';
import { VillaBookingDto } from '../../villa-booking/dto';

export interface IBookingCustomerDto
  extends Omit<BookingCustomer, 'activityBookings' | 'villaBookings'> {}

export interface IBookingCustomerWithRelationsDto extends IBookingCustomerDto {
  activityBookings?: ActivityBookingDto[];
  villaBookings?: VillaBookingDto[];
}

export class BookingCustomerDto implements IBookingCustomerDto {
  readonly id!: string;
  readonly name!: string;
  readonly email!: string;
  readonly phoneCountryCode!: string;
  readonly phoneNumber!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BookingCustomerWithRelationsDto
  extends BookingCustomerDto
  implements IBookingCustomerWithRelationsDto
{
  readonly activityBookings?: ActivityBookingDto[];
  readonly villaBookings?: VillaBookingDto[];
}
