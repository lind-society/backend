import {
  constructPhoneNumber,
  constructReadableDateTime,
} from '@apps/main/common/helpers';
import { BookingType } from '@apps/main/database/entities';
import { BadRequestException } from '@nestjs/common';
import { BookingWithRelationsDto } from '../../booking/dto';
import { CreatePaymentRequestDto } from '../../payment/dto';
import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableItemType,
  PaymentAvailableType,
} from '../../payment/enum';

const frontendBaseUrl = process.env.FE_PRODUCTION;

export function constructPaymentPayload(
  bookingPaymentId: string,
  payload: CreatePaymentRequestDto,
  bookingDetail: BookingWithRelationsDto,
): CreatePaymentRequestDto {
  const result = {
    ...payload,
    referenceId: bookingPaymentId,
    type: PaymentAvailableType.Pay,
    country: PaymentAvailableCountry.Indonesia,
    currency: PaymentAvailableCurrency.IDR,
    requestAmount: payload.requestAmount
      ? Number(payload.requestAmount)
      : Number(bookingDetail.totalAmount),
    captureMethod:
      payload.captureMethod ?? PaymentAvailableCaptureMethod.Automatic,
    channelProperties: {
      ...payload.channelProperties,
      payerName: bookingDetail.customer.name,
      payerEmail: bookingDetail.customer.email,
      paymentCode: constructPaymentCode(bookingDetail.type),
      successReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
      failureReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
      cancelReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
      pendingReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
      suggestedAmount: payload.channelProperties?.suggestedAmount
        ? String(payload.channelProperties?.suggestedAmount)
        : String(bookingDetail.totalAmount),
      displayName: bookingDetail.customer.name,
      accountEmail: bookingDetail.customer.email,
      accountMobileNumber: constructPhoneNumber(
        bookingDetail.customer.phoneCountryCode,
        bookingDetail.customer.phoneNumber,
      ),
      cashtag: constructCashTag(bookingDetail.customer.name),
    },
    items: [
      {
        referenceId:
          bookingDetail.type === BookingType.Activity
            ? bookingDetail.activityId
            : bookingDetail.villaId,
        currency: PaymentAvailableCurrency.IDR,
        type:
          bookingDetail.type === BookingType.Activity
            ? PaymentAvailableItemType.PhysicalService
            : PaymentAvailableItemType.PhysicalProduct,
        name:
          bookingDetail.type === BookingType.Activity
            ? bookingDetail.activity.name
            : bookingDetail.villa.name,
        netUnitAmount: Number(bookingDetail.totalAmount),
        quantity: 1,
        url:
          bookingDetail.type === BookingType.Activity
            ? `${frontendBaseUrl}/activities/${bookingDetail.activity.id}`
            : `${frontendBaseUrl}/villas/${bookingDetail.villa.id}`,
        imageUrl:
          bookingDetail.type === BookingType.Activity
            ? bookingDetail.activity?.photos?.[0]
            : bookingDetail.villa?.photos?.[0],
        category: bookingDetail.type,
        subCategory:
          bookingDetail.type === BookingType.Activity
            ? bookingDetail.activity.isFavorite === true
              ? 'favorite'
              : 'standard'
            : bookingDetail.villa.isFavorite === true
              ? 'favorite'
              : 'standard',
        description: constructBookingItemDescription(bookingDetail),
      },
    ],
  };

  return result;
}

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
