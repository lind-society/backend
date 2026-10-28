import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  ActivityBookingStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { BookingWithRelationsDto } from '../../dto';

/** Only the fields the book-inform page actually renders. */
export interface BookingPublicPropertyDto {
  id: string;
  name: string;
  secondaryName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  mapLink: string | null;
  photos: string[];
}

export interface BookingPublicPaymentDto {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentChannel: string | null;
  paidAt: Date | null;
}

/**
 * The payload behind the guest's booking link.
 *
 * Deliberately hand-built rather than reusing `BookingWithRelationsDto`: that
 * one carries the owner's email, phone and address plus the full payment
 * failure history, none of which belongs in the hands of whoever holds the
 * link.
 */
export class BookingPublicDto {
  readonly id: string;
  readonly type: BookingType;
  readonly status: ActivityBookingStatus | VillaBookingStatus | null;
  readonly totalGuest: number;
  readonly totalAmount: number;
  readonly bookingDate: Date | null;
  readonly checkInDate: Date | null;
  readonly checkOutDate: Date | null;
  readonly accessExpiresAt: Date | null;
  readonly currency: {
    id: string;
    code: string;
    symbol: string;
  } | null;
  readonly customer: {
    name: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
  } | null;
  readonly property: BookingPublicPropertyDto | null;
  readonly payments: BookingPublicPaymentDto[];

  constructor(booking: BookingWithRelationsDto) {
    const property =
      booking.type === BookingType.Activity ? booking.activity : booking.villa;

    this.id = booking.id;
    this.type = booking.type;
    this.status = booking.status;
    this.totalGuest = booking.totalGuest;
    this.totalAmount = Number(booking.totalAmount);
    this.bookingDate = booking.bookingDate;
    this.checkInDate = booking.checkInDate;
    this.checkOutDate = booking.checkOutDate;
    this.accessExpiresAt = booking.accessExpiresAt;

    this.currency = booking.currency
      ? {
          id: booking.currency.id,
          code: booking.currency.code,
          symbol: booking.currency.symbol,
        }
      : null;

    this.customer = booking.customer
      ? {
          name: booking.customer.name,
          email: booking.customer.email,
          phoneCountryCode: booking.customer.phoneCountryCode,
          phoneNumber: booking.customer.phoneNumber,
        }
      : null;

    this.property = property
      ? {
          id: property.id,
          name: property.name,
          secondaryName: property.secondaryName ?? null,
          address: property.address ?? null,
          city: property.city ?? null,
          state: property.state ?? null,
          country: property.country ?? null,
          mapLink: property.mapLink ?? null,
          photos: property.photos ?? [],
        }
      : null;

    this.payments = (booking.payments ?? []).map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      status: payment.status,
      paymentMethod: payment.paymentMethod ?? null,
      paymentChannel: payment.paymentChannel ?? null,
      paidAt: payment.paidAt ?? null,
    }));
  }
}

export class GetPublicBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPublicDto>
{
  readonly data: BookingPublicDto;

  constructor(data: BookingPublicDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
