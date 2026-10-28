import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import {
  PaymentAvailablePaymentStatus,
  PaymentAvailableRequestStatus,
  PaymentAvailableSessionStatus,
} from '@apps/main/modules/payment/enum';
import { mapXenditToGenericPaymentRequestAvailableStatus as map } from './xendit-payment-request-status-enum.mapper.helper';

/**
 * The webhook carries a payment object, not a payment request, so its status
 * vocabulary is a third one — and it is the vocabulary that actually reaches
 * production. These cases exist because an unmapped status used to raise, and
 * Xendit answers a non-2xx by retrying for 24 hours.
 */
describe('mapXenditToGenericPaymentRequestAvailableStatus', () => {
  it('maps PENDING, which only the payment webhook sends', () => {
    expect(map(PaymentAvailablePaymentStatus.Pending)).toBe(
      BookingPaymentAvailableStatus.Pending,
    );
  });

  it.each([
    [PaymentAvailableRequestStatus.Succeeded, BookingPaymentAvailableStatus.Paid],
    [PaymentAvailableRequestStatus.Failed, BookingPaymentAvailableStatus.Failed],
    [PaymentAvailableRequestStatus.Expired, BookingPaymentAvailableStatus.Expired],
    [PaymentAvailableRequestStatus.Canceled, BookingPaymentAvailableStatus.Canceled],
    [
      PaymentAvailableRequestStatus.Authorized,
      BookingPaymentAvailableStatus.Authorized,
    ],
    [
      PaymentAvailableRequestStatus.AcceptingPayments,
      BookingPaymentAvailableStatus.Pending,
    ],
    [
      PaymentAvailableRequestStatus.RequiresAction,
      BookingPaymentAvailableStatus.Pending,
    ],
    [PaymentAvailableSessionStatus.Active, BookingPaymentAvailableStatus.Active],
    [PaymentAvailableSessionStatus.Completed, BookingPaymentAvailableStatus.Paid],
  ])('maps %s', (input, expected) => {
    expect(map(input)).toBe(expected);
  });

  it('falls back to pending on a status Xendit has not told us about', () => {
    expect(map('SOMETHING_NEW' as PaymentAvailableRequestStatus)).toBe(
      BookingPaymentAvailableStatus.Pending,
    );
  });

  it('never resolves an unknown status to paid', () => {
    // The one outcome that would confirm a booking on a payment nobody made.
    for (const status of ['', null, undefined, 'SUCCEEDED_MAYBE', 'PAID']) {
      expect(map(status as PaymentAvailableRequestStatus)).not.toBe(
        BookingPaymentAvailableStatus.Paid,
      );
    }
  });
});
