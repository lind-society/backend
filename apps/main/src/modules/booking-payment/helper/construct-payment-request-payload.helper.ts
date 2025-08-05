import { constructPhoneNumber } from '@apps/main/common/helpers';
import { BookingType } from '@apps/main/database/entities';
import { BookingWithRelationsDto } from '../../booking/dto';
import { CreatePaymentRequestDto } from '../../payment/dto';
import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableItemType,
  PaymentAvailableType,
} from '../../payment/enum';
import {
  constructBookingItemDescription,
  constructCashTag,
  constructPaymentCode,
} from './construct-shared-payment-field.helper';

const frontendBaseUrl = process.env.FE_PRODUCTION;

export function constructPaymentRequestPayload(
  bookingPaymentId: string,
  payload: CreatePaymentRequestDto,
  bookingDetail: BookingWithRelationsDto,
): CreatePaymentRequestDto {
  return {
    ...payload,
    referenceId: bookingPaymentId,
    type: payload.type ?? PaymentAvailableType.Pay,
    country: payload.country ?? PaymentAvailableCountry.Indonesia,
    currency: payload.currency ?? PaymentAvailableCurrency.IDR,
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
        referenceId: bookingDetail.id,
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
}
