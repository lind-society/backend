import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import { PaymentAvailableSessionStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentSessionAvailableStatus(
  status: PaymentAvailableSessionStatus,
): BookingPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailableSessionStatus.Active:
      return BookingPaymentAvailableStatus.Pending;
    case PaymentAvailableSessionStatus.Completed:
      return BookingPaymentAvailableStatus.Paid;
    case PaymentAvailableSessionStatus.Expired:
      return BookingPaymentAvailableStatus.Expired;
    case PaymentAvailableSessionStatus.Canceled:
      return BookingPaymentAvailableStatus.Canceled;
    default:
      throw new InternalServerErrorException(
        `invalid xendit payment request status`,
      );
  }
}
