import {
  PaymentAvailableCurrency,
  PaymentAvailableRefundReason,
} from '../../../../enum';

export interface IXenditCreatePaymentRefundDto {
  payment_request_id: string;
  reference_id?: string;
  currency?: PaymentAvailableCurrency;
  amount?: number;
  reason?: PaymentAvailableRefundReason;
  metadata?: Record<string, any>;
}

export class XenditCreatePaymentRefundDto
  implements IXenditCreatePaymentRefundDto
{
  payment_request_id: string;
  reference_id?: string;
  currency?: PaymentAvailableCurrency;
  amount?: number;
  reason?: PaymentAvailableRefundReason;
  metadata?: Record<string, any>;
}
