import {
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentMethodType,
  PaymentAvailableRefundReason,
  PaymentAvailableRefundStatus,
} from '../../enum';
import {
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';

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
  failureCode: PaymentAvailableFailureCode;
  refundFeeAmount: number;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface IPaymentRefundWebhookDto
  extends IPaymentBaseCallbackDto<IPaymentRefundDto> {
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
  failureCode: PaymentAvailableFailureCode;
  refundFeeAmount: number;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export class PaymentRefundWebhookDto
  extends PaymentBaseCallbackDto<PaymentRefundDto>
  implements IPaymentRefundWebhookDto
{
  data: PaymentRefundDto;
}
