import {
  constructFrontendUrl,
  constructPhoneNumber,
} from '@apps/main/common/helpers';
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

/**
 * Where the gateway sends the guest back after a redirect-based payment.
 *
 * It has to be the tokenised booking link: the guest has no account, so
 * `/booking/<token>` is the only page they can open, and it is where they can
 * watch the payment land. Falls back to the site root when the link cannot be
 * resolved, which is still better than a URL nobody can open.
 */
function resolveReturnUrl(bookingLink?: string | null): string {
  return bookingLink ?? constructFrontendUrl();
}

/**
 * @param amountDue what the guest is being charged. Decided by the caller from
 *   the stored booking payment — never from the request body. This route is
 *   reachable by anyone holding the booking link, so a client-supplied
 *   `requestAmount` would let a guest bill themselves any figure they liked and
 *   still have the gateway confirm the booking.
 */
export function constructPaymentRequestPayload(
  bookingPaymentId: string,
  payload: CreatePaymentRequestDto,
  bookingDetail: BookingWithRelationsDto,
  amountDue: number,
  bookingLink?: string | null,
): CreatePaymentRequestDto {
  const returnUrl = resolveReturnUrl(bookingLink);
  const frontendBaseUrl = constructFrontendUrl();

  return {
    ...payload,
    referenceId: bookingPaymentId,
    type: payload.type ?? PaymentAvailableType.Pay,
    country: payload.country ?? PaymentAvailableCountry.Indonesia,
    currency: payload.currency ?? PaymentAvailableCurrency.IDR,
    requestAmount: amountDue,
    captureMethod:
      payload.captureMethod ?? PaymentAvailableCaptureMethod.Automatic,
    channelProperties: {
      ...payload.channelProperties,
      payerName: bookingDetail.customer.name,
      payerEmail: bookingDetail.customer.email,
      paymentCode: constructPaymentCode(bookingDetail.type),
      successReturnUrl: returnUrl,
      failureReturnUrl: returnUrl,
      cancelReturnUrl: returnUrl,
      pendingReturnUrl: returnUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
      // Same rule as the amount itself: a "suggested" figure the payer can act
      // on is not the client's to choose.
      suggestedAmount: String(amountDue),
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
  };
}
