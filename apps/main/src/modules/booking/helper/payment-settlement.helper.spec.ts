import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import { settlePaymentCallbackAmount } from './payment-settlement.helper';

/**
 * The rule these tests pin down: a gateway callback may report money, but it
 * may not decide what the booking cost. Everything here is a case where
 * trusting the callback would confirm a booking that was not paid for.
 */
describe('settlePaymentCallbackAmount', () => {
  const paid = BookingPaymentAvailableStatus.Paid;
  const held = BookingPaymentAvailableStatus.RequiresAction;
  const now = new Date('2026-01-01T00:00:00.000Z');

  it('settles when the reported amount matches what was billed', () => {
    const result = settlePaymentCallbackAmount(5_400_000, 5_400_000, paid, now);

    expect(result.status).toBe(paid);
    expect(result.paidAt).toBe(now);
    expect(result.held).toBe(false);
    expect(result.overpaid).toBe(false);
  });

  it('holds a payment that reports less than was billed', () => {
    const result = settlePaymentCallbackAmount(5_400_000, 1_000, paid, now);

    expect(result.status).toBe(held);
    expect(result.paidAt).toBeNull();
    expect(result.held).toBe(true);
    expect(result.failureReason).toContain('underpaid');
  });

  it('holds a payment one rupiah short — there is no "close enough"', () => {
    const result = settlePaymentCallbackAmount(5_400_000, 5_399_999, paid, now);

    expect(result.status).toBe(held);
    expect(result.held).toBe(true);
  });

  it('settles an overpayment but flags it for refund', () => {
    const result = settlePaymentCallbackAmount(5_400_000, 6_000_000, paid, now);

    expect(result.status).toBe(paid);
    expect(result.paidAt).toBe(now);
    expect(result.held).toBe(false);
    expect(result.overpaid).toBe(true);
  });

  it('compares numerically when the stored amount is a decimal string', () => {
    // TypeORM hands `numeric` columns back as strings; a string comparison here
    // would read "5400000" < "999" and hold every correct payment.
    const result = settlePaymentCallbackAmount('5400000.00', 5_400_000, paid, now);

    expect(result.status).toBe(paid);
    expect(result.held).toBe(false);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['not a number', 'abc'],
  ])('holds a settled callback whose amount is %s', (_label, amount) => {
    const result = settlePaymentCallbackAmount(5_400_000, amount, paid, now);

    expect(result.status).toBe(held);
    expect(result.paidAt).toBeNull();
    expect(result.held).toBe(true);
  });

  it('holds when we have no expected amount to compare against', () => {
    const result = settlePaymentCallbackAmount(null, 5_400_000, paid, now);

    expect(result.status).toBe(held);
    expect(result.failureReason).toBe('no expected amount on record');
  });

  it.each([
    BookingPaymentAvailableStatus.Failed,
    BookingPaymentAvailableStatus.Expired,
    BookingPaymentAvailableStatus.Pending,
    BookingPaymentAvailableStatus.Canceled,
  ])('never stamps a paid-at date on a %s callback', (status) => {
    const result = settlePaymentCallbackAmount(5_400_000, 5_400_000, status, now);

    expect(result.status).toBe(status);
    expect(result.paidAt).toBeNull();
    expect(result.held).toBe(false);
  });
});
