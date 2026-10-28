import { constructFrontendUrl } from '@apps/main/common/helpers';
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

/**
 * @param amountDue what the guest is being charged, taken from the stored
 *   booking payment rather than the booking total so a part payment is not
 *   silently re-billed in full.
 */
export function constructPaymentSessionPayload(
  bookingPaymentId: string,
  payload: CreatePaymentSessionDto,
  bookingDetail: BookingWithRelationsDto,
  amountDue: number,
  bookingLink?: string | null,
): CreatePaymentSessionDto {
  const frontendBaseUrl = constructFrontendUrl();
  // The guest has no account, so their tokenised link is the only page they can
  // be sent back to after the card flow.
  const returnUrl = bookingLink ?? frontendBaseUrl;

  return {
    ...payload,
    referenceId: bookingPaymentId,
    customer: constructPaymentCustomer(
      bookingDetail.customer.id,
      bookingDetail.customer.name,
    ),
    sessionType: payload.sessionType ?? PaymentAvailableSessionType.Pay,
    currency: PaymentAvailableCurrency.IDR,
    amount: amountDue,
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
        netUnitAmount: amountDue,
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
    successReturnUrl: returnUrl,
    cancelReturnUrl: returnUrl,
    cardsSessionJS: {
      successReturnUrl: returnUrl,
      failureReturnUrl: returnUrl,
    },
  };
}
