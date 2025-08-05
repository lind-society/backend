import { InvoiceCallbackDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentInvoiceCallbackDto } from '../../../dto';

export function mapGenericToXenditPaymentInvoiceCallbackDto(
  payload: InvoiceCallbackDto,
): XenditPaymentInvoiceCallbackDto {
  const metadata = payload.metadata || {};

  return {
    id: payload.id,
    external_id: payload.externalId,
    status: payload.status,
    amount: payload.amount,
    currency: payload.currency,
    paid_at: payload.paidAt || '',
    paid_amount: payload.paidAmount || 0,
    payer_email: payload.payerEmail || '',
    payment_method: payload.paymentMethod || '',
    description: payload.description || '',
    created: payload.createdAt || '',
    updated: payload.updatedAt || '',
    user_id: metadata.userId || '',
    is_high: metadata.isHigh || false,
    merchant_name: metadata.merchantName || '',
    bank_code: metadata.bankCode || '',
    adjusted_received_amount: metadata.adjustedReceivedAmount || 0,
    fees_paid_amount: metadata.feesPaidAmount || 0,
    payment_channel: metadata.paymentChannel || '',
    payment_destination: metadata.paymentDestination || '',
  };
}

export function mapXenditToGenericInvoiceCallbackDto(
  payload: XenditPaymentInvoiceCallbackDto,
): InvoiceCallbackDto {
  return {
    id: payload.id,
    externalId: payload.external_id,
    status: payload.status,
    amount: payload.amount,
    currency: payload.currency,
    paidAt: payload.paid_at || '',
    paidAmount: payload.paid_amount || 0,
    payerEmail: payload.payer_email || '',
    paymentMethod: payload.payment_method || '',
    description: payload.description || '',
    createdAt: payload.created || '',
    updatedAt: payload.updated || '',
  };
}
