import { PaymentAvailableRefundStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';

export function mapXenditToGenericPaymentRefundAvailableStatus(
  status: PaymentAvailableRefundStatus,
): boolean {
  switch (status) {
    case PaymentAvailableRefundStatus.Succeeded:
      return true;
    case PaymentAvailableRefundStatus.Pending:
      return false;
    case PaymentAvailableRefundStatus.Cancelled:
      return false;
    case PaymentAvailableRefundStatus.Failed:
      return false;
    default:
      throw new InternalServerErrorException(
        `invalid xendit payment refund status`,
      );
  }
}
