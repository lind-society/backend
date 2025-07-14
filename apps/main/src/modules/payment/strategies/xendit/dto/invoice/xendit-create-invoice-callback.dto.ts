export interface IXenditInvoiceCallbackDto {
  id: string;
  externalId: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string;
  paidAmount?: number;
  payerEmail?: string;
  paymentMethod?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export class XenditInvoiceCallbackDto implements IXenditInvoiceCallbackDto {
  id: string;
  externalId: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string;
  paidAmount?: number;
  payerEmail?: string;
  paymentMethod?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}
