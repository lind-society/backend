import {
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentMethodType,
  PaymentAvailableRefundReason,
  PaymentAvailableRefundStatus,
} from '../../enum';
import {
  IPaymentBaseWebhookDto,
  PaymentBaseWebhookDto,
} from '../payment-base-webhook.dto';

export interface IPaymentRefundDto {
  id: string;
  paymentRequestId: string;
  paymentId: string;
  invoiceId: string;
  paymentMethodType: PaymentAvailablePaymentMethodType;
  referenceId: string;
  channelCode: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure: PaymentAvailableFailureCode;
  created: string;
  updated: string;
}

export interface IPaymentRefundWebhookDto
  extends IPaymentBaseWebhookDto<IPaymentRefundDto> {
  data: IPaymentRefundDto;
}

export class PaymentRefundDto implements IPaymentRefundDto {
  id: string;
  paymentRequestId: string;
  paymentId: string;
  invoiceId: string;
  paymentMethodType: PaymentAvailablePaymentMethodType;
  referenceId: string;
  channelCode: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure: PaymentAvailableFailureCode;
  created: string;
  updated: string;
}

export class PaymentRefundWebhookDto
  extends PaymentBaseWebhookDto<PaymentRefundDto>
  implements IPaymentRefundWebhookDto
{
  data: PaymentRefundDto;
}
