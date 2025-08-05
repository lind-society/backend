import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import { PaymentAvailableTokenStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentTokenAvailableStatus(
  status: PaymentAvailableTokenStatus,
): BookingPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailableTokenStatus.RequiresAction:
      return BookingPaymentAvailableStatus.RequiresAction;
    case PaymentAvailableTokenStatus.Pending:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableTokenStatus.Active:
      return BookingPaymentAvailableStatus.Active;
    case PaymentAvailableTokenStatus.Failed:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailableTokenStatus.Expired:
      return BookingPaymentAvailableStatus.Expired;
    case PaymentAvailableTokenStatus.Canceled:
      return BookingPaymentAvailableStatus.Canceled;
    default:
      throw new InternalServerErrorException(
        `invalid xendit payment token status`,
      );
  }
}
