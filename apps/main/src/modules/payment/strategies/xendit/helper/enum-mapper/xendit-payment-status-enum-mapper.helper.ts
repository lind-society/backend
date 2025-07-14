import { PaymentStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';
import { XenditPaymentStatus } from '../../enum';

export function mapXenditToGenericPaymentStatus(
  status: XenditPaymentStatus,
): PaymentStatus {
  switch (status) {
    case XenditPaymentStatus.Pending:
      return PaymentStatus.Pending;
    case XenditPaymentStatus.Paid:
      return PaymentStatus.Paid;
    case XenditPaymentStatus.Expired:
      return PaymentStatus.Expired;
    default:
      throw new InternalServerErrorException(`invalid xendit payment statuws`);
  }
}

export function mapGenericToXenditPaymentStatus(
  status: PaymentStatus,
): XenditPaymentStatus {
  switch (status) {
    case PaymentStatus.Pending:
      return XenditPaymentStatus.Pending;
    case PaymentStatus.Paid:
      return XenditPaymentStatus.Paid;
    case PaymentStatus.Expired:
      return XenditPaymentStatus.Expired;
    default:
      throw new InternalServerErrorException(`invalid payment statuws`);
  }
}
