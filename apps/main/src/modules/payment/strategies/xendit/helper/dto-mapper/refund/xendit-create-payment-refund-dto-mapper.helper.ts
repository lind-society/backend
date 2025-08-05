import { CreatePaymentRefundDto } from '@apps/main/modules/payment/dto/refund';
import { XenditCreatePaymentRefundDto } from '../../../dto/refund';

export function mapGenericToXenditCreatePaymentRefundDto(
  payload: CreatePaymentRefundDto,
): XenditCreatePaymentRefundDto {
  return {
    payment_request_id: payload.paymentRequestId,
    reference_id: payload.referenceId,
    currency: payload.currency,
    amount: payload.amount,
    reason: payload.reason,
    metadata: payload.metadata,
  };
}
