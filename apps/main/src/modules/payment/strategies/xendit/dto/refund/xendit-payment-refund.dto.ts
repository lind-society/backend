import {
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentMethodType,
  PaymentAvailableRefundReason,
  PaymentAvailableRefundStatus,
} from '../../../../enum';
import {
  IXenditPaymentBaseWebhookDto,
  XenditPaymentBaseWebhookDto,
} from '../xendit-payment-base-webhook.dto';

export interface IPaymentRefundDto {
  id: string;
  payment_request_id: string;
  payment_id: string;
  invoice_id: string;
  payment_method_type: PaymentAvailablePaymentMethodType;
  reference_id: string;
  channel_code: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure: PaymentAvailableFailureCode;
  created: string;
  updated: string;
}

export interface IPaymentRefundWebhookDto
  extends IXenditPaymentBaseWebhookDto<IPaymentRefundDto> {
  data: IPaymentRefundDto;
}

export class PaymentRefundDto implements IPaymentRefundDto {
  id: string;
  payment_request_id: string;
  payment_id: string;
  invoice_id: string;
  payment_method_type: PaymentAvailablePaymentMethodType;
  reference_id: string;
  channel_code: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure: PaymentAvailableFailureCode;
  created: string;
  updated: string;
}

export class PaymentRefundWebhookDto
  extends XenditPaymentBaseWebhookDto<PaymentRefundDto>
  implements IPaymentRefundWebhookDto
{
  data: PaymentRefundDto;
}
