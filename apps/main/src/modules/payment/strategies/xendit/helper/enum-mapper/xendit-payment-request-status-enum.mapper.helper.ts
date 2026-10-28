import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import {
  PaymentAvailablePaymentStatus,
  PaymentAvailableRequestStatus,
  PaymentAvailableSessionStatus,
} from '@apps/main/modules/payment/enum';
import { Logger } from '@nestjs/common';

const logger = new Logger('XenditPaymentStatusMapper');

/**
 * Translates a Xendit status into ours.
 *
 * Three vocabularies land here: the payment request's, the session's, and — via
 * the webhook, which carries a payment object rather than a payment request —
 * the payment's. `PENDING` only exists in the last of the three, which is why
 * it was missing.
 *
 * An unrecognised status resolves to `pending` rather than raising. Xendit
 * retries a webhook up to six times over 24 hours until it sees a 2xx, so
 * throwing here would turn one unknown status into a day-long retry storm that
 * never records the payment. `pending` is the safe landing: it never confirms a
 * booking, and the warning says what arrived.
 * https://docs.xendit.co/apidocs/webhook-behavior
 */
export function mapXenditToGenericPaymentRequestAvailableStatus(
  status:
    | PaymentAvailableRequestStatus
    | PaymentAvailableSessionStatus
    | PaymentAvailablePaymentStatus,
): BookingPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailableRequestStatus.Authorized:
      return BookingPaymentAvailableStatus.Authorized;
    case PaymentAvailableSessionStatus.Active:
      return BookingPaymentAvailableStatus.Active;
    case PaymentAvailableRequestStatus.AcceptingPayments:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableRequestStatus.RequiresAction:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailablePaymentStatus.Pending:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableRequestStatus.Succeeded:
    case PaymentAvailableSessionStatus.Completed:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailableRequestStatus.Expired:
    case PaymentAvailableSessionStatus.Expired:
      return BookingPaymentAvailableStatus.Expired;
    case PaymentAvailableRequestStatus.Canceled:
    case PaymentAvailableSessionStatus.Canceled:
      return BookingPaymentAvailableStatus.Canceled;
    case PaymentAvailableRequestStatus.Failed:
      return BookingPaymentAvailableStatus.Failed;
    default:
      logger.warn(
        `unrecognised xendit payment status "${status}" — recording the payment as pending`,
      );

      return BookingPaymentAvailableStatus.Pending;
  }
}
