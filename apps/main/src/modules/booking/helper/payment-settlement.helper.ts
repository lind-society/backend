import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';

/**
 * What a gateway callback is allowed to settle.
 *
 * `held` marks the cases a human has to look at: the money that arrived does
 * not match what we asked for, so the booking must not be confirmed even though
 * the gateway called it a success.
 */
export interface PaymentSettlement {
  status: BookingPaymentAvailableStatus;
  paidAt: Date | null;
  failureReason?: string;
  held: boolean;
  overpaid: boolean;
}

/**
 * Reconciles the amount a gateway reports against the amount we asked for.
 *
 * The gateway reports what it collected; we hold what the guest was billed.
 * Those are two different numbers and only the second one is ours, so a
 * callback reporting less than the outstanding balance — a short transfer into
 * a virtual account, a partial capture, or a forged payload — is parked in
 * `requires_action` rather than confirming a booking nobody paid for.
 *
 * Paying more than asked is not the guest's problem to fix: the booking is
 * confirmed and the surplus left for the team to refund.
 *
 * @param expectedAmount the stored amount on the booking payment
 * @param reportedAmount whatever the callback claims was collected
 * @param mappedStatus the gateway status already mapped to our vocabulary
 */
export function settlePaymentCallbackAmount(
  expectedAmount: number | string | null | undefined,
  reportedAmount: number | string | null | undefined,
  mappedStatus: BookingPaymentAvailableStatus,
  now: Date = new Date(),
): PaymentSettlement {
  // Anything that is not a settlement carries no money to reconcile, and must
  // not stamp a paid-at date — a failed or expired payment holding a settlement
  // timestamp reads as revenue in every report that follows.
  if (mappedStatus !== BookingPaymentAvailableStatus.Paid) {
    return { status: mappedStatus, paidAt: null, held: false, overpaid: false };
  }

  // `Number(null)` and `Number('')` are both 0, not NaN, so a missing amount
  // would sail through a plain isFinite check and read as a zero-rupiah bill.
  const toAmount = (value: number | string | null | undefined): number =>
    value === null || value === undefined || value === '' ? NaN : Number(value);

  const expected = toAmount(expectedAmount);
  const received = toAmount(reportedAmount);

  if (!Number.isFinite(received)) {
    return {
      status: BookingPaymentAvailableStatus.RequiresAction,
      paidAt: null,
      failureReason: 'settled callback carried no amount',
      held: true,
      overpaid: false,
    };
  }

  // A payment we cannot price cannot be reconciled either, and defaulting to
  // "close enough" here would confirm bookings on an unknown balance.
  if (!Number.isFinite(expected)) {
    return {
      status: BookingPaymentAvailableStatus.RequiresAction,
      paidAt: null,
      failureReason: 'no expected amount on record',
      held: true,
      overpaid: false,
    };
  }

  if (received < expected) {
    return {
      status: BookingPaymentAvailableStatus.RequiresAction,
      paidAt: null,
      failureReason: `underpaid: expected ${expected}, received ${received}`,
      held: true,
      overpaid: false,
    };
  }

  return {
    status: BookingPaymentAvailableStatus.Paid,
    paidAt: now,
    held: false,
    overpaid: received > expected,
  };
}
