import { BookingCustomer } from '@apps/main/database/entities';
import { BookingDto } from '../../dto';

export interface IBookingCustomerDto
  extends Omit<BookingCustomer, 'bookings'> {}

export interface IBookingCustomerWithRelationsDto extends IBookingCustomerDto {
  Bookings?: BookingDto[];
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
  readonly bookings?: BookingDto[];
}
