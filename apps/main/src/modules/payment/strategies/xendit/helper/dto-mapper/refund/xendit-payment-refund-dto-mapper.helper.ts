import { PaymentRefundDto } from '@apps/main/modules/payment/dto/refund';
import { XenditPaymentRefundDto } from '../../../dto/refund';

export function mapGenericToXenditPaymentRefundDto(
  payload: PaymentRefundDto,
): XenditPaymentRefundDto {
  return {
    id: payload.id,
    payment_request_id: payload.paymentRequestId,
    payment_id: payload.paymentId,
    invoice_id: payload.invoiceId,
    payment_method_type: payload.paymentMethodType,
    reference_id: payload.referenceId,
    channel_code: payload.channelCode,
    currency: payload.currency,
    amount: payload.amount,
    refund_fee_amount: payload.refundFeeAmount,
    status: payload.status,
    reason: payload.reason,
    failure_code: payload.failureCode,
    created: payload.created,
    updated: payload.updated,
    metadata: payload.metadata,
  };
}

export function mapXenditToGenericPaymentRefundDto(
  payload: XenditPaymentRefundDto,
): PaymentRefundDto {
  return {
    id: payload.id,
    paymentRequestId: payload.payment_request_id,
    paymentId: payload.payment_id,
    invoiceId: payload.invoice_id,
    paymentMethodType: payload.payment_method_type,
    referenceId: payload.reference_id,
    channelCode: payload.channel_code,
    currency: payload.currency,
    amount: payload.amount,
    refundFeeAmount: payload.refund_fee_amount,
    status: payload.status,
    reason: payload.reason,
    failureCode: payload.failure_code,
    created: payload.created,
    updated: payload.updated,
    metadata: payload.metadata,
  };
}
