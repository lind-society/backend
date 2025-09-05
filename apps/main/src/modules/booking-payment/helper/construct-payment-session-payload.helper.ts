import { BookingType } from '@apps/main/database/entities';
import { BookingWithRelationsDto } from '../../booking/dto';
import { CreatePaymentSessionDto } from '../../payment/dto';
import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableItemType,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionType,
} from '../../payment/enum';
import { constructPaymentCustomer } from './construct-payment-customer-payload.helper';
import { constructBookingItemDescription } from './construct-shared-payment-field.helper';

const frontendBaseUrl = process.env.FE_PRODUCTION;

export function constructPaymentSessionPayload(
  bookingPaymentId: string,
  payload: CreatePaymentSessionDto,
  bookingDetail: BookingWithRelationsDto,
): CreatePaymentSessionDto {
  return {
    ...payload,
    referenceId: bookingPaymentId,
    customer: constructPaymentCustomer(
      bookingDetail.customer.id,
      bookingDetail.customer.name,
    ),
    sessionType: payload.sessionType ?? PaymentAvailableSessionType.Pay,
    currency: PaymentAvailableCurrency.IDR,
    amount: Number(bookingDetail.totalAmount),
    mode: PaymentAvailableSessionMode.CardsSessionJS,
    captureMethod:
      payload.captureMethod ?? PaymentAvailableCaptureMethod.Automatic,
    country: PaymentAvailableCountry.Indonesia,
    channelProperties: {
      cards: {
        ...payload.channelProperties?.cards,
      },
    },
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
    items: [
      {
        referenceId: `${bookingDetail.id}`,
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
    successReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
    cancelReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
    cardsSessionJS: {
      successReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
      failureReturnUrl: `${frontendBaseUrl}/bookings/${bookingDetail.id}`,
    },
  };
}
