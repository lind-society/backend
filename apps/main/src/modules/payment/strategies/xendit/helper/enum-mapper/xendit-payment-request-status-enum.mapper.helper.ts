import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import { PaymentAvailableRequestStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentRequestAvailableStatus(
  status: PaymentAvailableRequestStatus,
): BookingPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailableRequestStatus.Authorized:
      return BookingPaymentAvailableStatus.Authorized;
    case PaymentAvailableRequestStatus.AcceptingPayments:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableRequestStatus.RequiresAction:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableRequestStatus.Succeeded:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailableRequestStatus.Expired:
      return BookingPaymentAvailableStatus.Expired;
    case PaymentAvailableRequestStatus.Cancelled:
      return BookingPaymentAvailableStatus.Canceled;
    case PaymentAvailableRequestStatus.Failed:
      return BookingPaymentAvailableStatus.Failed;
    default:
      throw new InternalServerErrorException(`invalid xendit payment status`);
  }
}
