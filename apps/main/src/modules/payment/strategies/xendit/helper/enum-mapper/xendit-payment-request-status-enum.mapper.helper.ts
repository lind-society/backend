import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import {
  PaymentAvailableRequestStatus,
  PaymentAvailableSessionStatus,
} from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentRequestAvailableStatus(
  status: PaymentAvailableRequestStatus | PaymentAvailableSessionStatus,
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
      throw new InternalServerErrorException(
        `invalid xendit payment request status`,
      );
  }
}
