import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import { PaymentAvailablePaymentStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentAvailableStatus(
  status: PaymentAvailablePaymentStatus,
): BookingPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailablePaymentStatus.Authorized:
      return BookingPaymentAvailableStatus.Authorized;
    case PaymentAvailablePaymentStatus.Pending:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailablePaymentStatus.Succeedeed:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailablePaymentStatus.Failed:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailablePaymentStatus.Expired:
      return BookingPaymentAvailableStatus.Expired;
    case PaymentAvailablePaymentStatus.Canceled:
      return BookingPaymentAvailableStatus.Canceled;
    default:
      throw new InternalServerErrorException(
        `invalid xendit payment token status`,
      );
  }
}
