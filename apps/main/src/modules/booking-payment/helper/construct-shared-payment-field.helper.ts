import { constructReadableDateTime } from '@apps/main/common/helpers';
import { BookingType } from '@apps/main/database/entities';
import { BadRequestException } from '@nestjs/common';
import { BookingWithRelationsDto } from '../../booking/dto';

export function constructBookingItemDescription(
  bookingDetail: BookingWithRelationsDto,
): string {
  switch (bookingDetail.type) {
    case BookingType.Activity:
      return `Booking activity ${bookingDetail.activity.name} for total guest ${bookingDetail.totalGuest} at ${constructReadableDateTime(bookingDetail.bookingDate)}`;
    case BookingType.Villa:
      return `Booking villa ${bookingDetail.villa.name} for total guest ${bookingDetail.totalGuest} from ${constructReadableDateTime(bookingDetail.checkInDate)} until ${constructReadableDateTime(bookingDetail.checkOutDate)}`;
    default:
      throw new BadRequestException(
        'invalid booking type (should be either activity or villa)',
      );
  }
}

export function constructPaymentCode(bookingType: BookingType): string {
  const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

  switch (bookingType) {
    case BookingType.Activity:
      return `A${randomCode}`;
    case BookingType.Villa:
      return `V${randomCode}`;
    default:
      throw new BadRequestException(
        'invalid booking type (should be either activity or villa)',
      );
  }
}

export function constructCashTag(customerName: string): string {
  // must match regex pattern of : \"^[$][a-zA-Z0-9_]{3,15}$\"
  const sanitizedCustomerName = customerName
    .trim() // remove leading/trailing spaces
    .replace(/\s+/g, '_') // replace all internal spaces with _
    .substring(0, 15); // limit to 15 characters

  return `$${sanitizedCustomerName}`;
}
