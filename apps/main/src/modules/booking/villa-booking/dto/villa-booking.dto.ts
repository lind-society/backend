import { VillaBooking, VillaBookingStatus } from '@apps/main/database/entities';
import { BookingCustomerDto } from '@apps/main/modules/booking/customer/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';
import { BookingPaymentDto } from '../../payment/dto';

export interface IVillaBookingDto
  extends Omit<VillaBooking, 'payments' | 'currency' | 'customer' | 'villa'> {}

export interface IVillaBookingWithRelationsDto extends IVillaBookingDto {
  currency?: CurrencyDto;
  customer?: BookingCustomerDto;
  payments?: BookingPaymentDto[];
  villa?: VillaDto;
}

export class VillaBookingDto implements IVillaBookingDto {
  readonly id!: string;
  readonly totalGuest: number;
  readonly totalAmount: number;
  readonly checkInDate: Date;
  readonly checkOutDate: Date;
  readonly status: VillaBookingStatus;
  readonly currencyId!: string;
  readonly customerId!: string;
  readonly villaId: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaBookingWithRelationsDto
  extends VillaBookingDto
  implements IVillaBookingWithRelationsDto
{
  readonly currency?: CurrencyDto;
  readonly customer?: BookingCustomerDto;
  readonly payments?: BookingPaymentDto[];
  readonly villa?: VillaDto;
}
