export interface IXenditPaymentInvoiceCallbackDto {
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string;
  payer_email: string;
  description: string;
  adjusted_received_amount: number;
  fees_paid_amount: number;
  updated: string;
  created: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
}

export class XenditPaymentInvoiceCallbackDto
  implements IXenditPaymentInvoiceCallbackDto
{
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string;
  payer_email: string;
  description: string;
  adjusted_received_amount: number;
  fees_paid_amount: number;
  updated: string;
  created: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
}
