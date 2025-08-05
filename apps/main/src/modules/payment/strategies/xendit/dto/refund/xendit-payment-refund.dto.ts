import {
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentMethodType,
  PaymentAvailableRefundReason,
  PaymentAvailableRefundStatus,
} from '../../../../enum';

export interface IXenditPaymentRefundDto {
  id: string;
  payment_request_id: string;
  payment_id: string;
  invoice_id: string;
  payment_method_type: PaymentAvailablePaymentMethodType;
  reference_id: string;
  channel_code: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  refund_fee_amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure_code: PaymentAvailableFailureCode;
  created: string;
  updated: string;
  metadata: Record<string, any>;
}

export class XenditPaymentRefundDto implements IXenditPaymentRefundDto {
  id: string;
  payment_request_id: string;
  payment_id: string;
  invoice_id: string;
  payment_method_type: PaymentAvailablePaymentMethodType;
  reference_id: string;
  channel_code: string;
  currency: PaymentAvailableCurrency;
  amount: number;
  refund_fee_amount: number;
  status: PaymentAvailableRefundStatus;
  reason: PaymentAvailableRefundReason;
  failure_code: PaymentAvailableFailureCode;
  created: string;
  updated: string;
  metadata: Record<string, any>;
}
