import {
  PaymentAvailableCurrency,
  PaymentAvailableRefundReason,
} from '../../enum';

export interface ICreatePaymentRefundDto {
  paymentRequestId: string;
  referenceId?: string;
  currency?: PaymentAvailableCurrency;
  amount?: number;
  reason?: PaymentAvailableRefundReason;
  metadata?: Record<string, any>;
}

export class CreatePaymentRefundDto implements ICreatePaymentRefundDto {
  paymentRequestId: string;
  referenceId?: string;
  currency?: PaymentAvailableCurrency;
  amount?: number;
  reason?: PaymentAvailableRefundReason;
  metadata?: Record<string, any>;
}
