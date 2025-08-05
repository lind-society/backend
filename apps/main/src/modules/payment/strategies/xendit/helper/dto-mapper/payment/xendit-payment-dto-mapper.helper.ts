import { PaymentDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentDto } from '../../../dto/';
import {
  mapXenditToGenericPaymentCaptureDto,
  mapXenditToGenericPaymentDetailsDto,
} from '../payment-request';

export function mapXenditToGenericPaymentDto(
  payload: XenditPaymentDto,
): PaymentDto {
  if (!payload) {
    return;
  }

  return {
    paymentId: payload.payment_id,
    businessId: payload.business_id,
    referenceId: payload.reference_id,
    paymentRequestId: payload.payment_request_id,
    paymentTokenId: payload.payment_token_id,
    customerId: payload.customer_id,
    type: payload.type,
    country: payload.country,
    currency: payload.currency,
    requestAmount: payload.request_amount,
    captureMethod: payload.capture_method,
    channelCode: payload.channel_code,
    captures: mapXenditToGenericPaymentCaptureDto(payload.captures),
    status: payload.status,
    paymentDetails: mapXenditToGenericPaymentDetailsDto(
      payload.payment_details,
    ),
    failureCode: payload.failure_code,
    metadata: payload.metadata,
    created: payload.created,
    updated: payload.updated,
  };
}
