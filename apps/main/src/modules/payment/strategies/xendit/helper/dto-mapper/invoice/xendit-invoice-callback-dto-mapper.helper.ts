import { InvoiceCallbackDto } from '@apps/main/modules/payment/dto';
import { XenditInvoiceCallbackDto } from '../../../dto';

export function mapGenericToXenditInvoiceCallbackDto(
  payload: InvoiceCallbackDto,
): XenditInvoiceCallbackDto {
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
