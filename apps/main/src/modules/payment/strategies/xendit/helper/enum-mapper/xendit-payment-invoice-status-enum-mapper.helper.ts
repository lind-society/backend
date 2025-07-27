import { PaymentAvailableInvoiceStatus } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';
import { XenditPaymentAvailableStatus } from '../../enum';

export function mapXenditToGenericInvoicePaymentAvailableStatus(
  status: XenditPaymentAvailableStatus,
): PaymentAvailableInvoiceStatus {
  switch (status) {
    case XenditPaymentAvailableStatus.Pending:
      return PaymentAvailableInvoiceStatus.Pending;
    case XenditPaymentAvailableStatus.Paid:
      return PaymentAvailableInvoiceStatus.Paid;
    case XenditPaymentAvailableStatus.Expired:
      return PaymentAvailableInvoiceStatus.Expired;
    default:
      throw new InternalServerErrorException(`invalid xendit payment statuws`);
  }
}

export function mapGenericToXenditPaymentAvailableStatus(
  status: PaymentAvailableInvoiceStatus,
): XenditPaymentAvailableStatus {
  switch (status) {
    case PaymentAvailableInvoiceStatus.Pending:
      return XenditPaymentAvailableStatus.Pending;
    case PaymentAvailableInvoiceStatus.Paid:
      return XenditPaymentAvailableStatus.Paid;
    case PaymentAvailableInvoiceStatus.Expired:
      return XenditPaymentAvailableStatus.Expired;
    default:
      throw new InternalServerErrorException(`invalid payment statuws`);
  }
}
