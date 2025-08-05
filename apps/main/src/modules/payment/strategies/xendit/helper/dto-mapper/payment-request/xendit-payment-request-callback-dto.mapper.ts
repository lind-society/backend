import {
  PaymentCaptureDto,
  PaymentDetailDto,
  PaymentRequestCallbackDataDto,
  PaymentRequestCallbackDto,
} from '@apps/main/modules/payment/dto';
import {
  XenditPaymentCaptureDto,
  XenditPaymentDetailDto,
  XenditPaymentRequestCallbackDataDto,
  XenditPaymentRequestCallbackDto,
} from '../../../dto/';
import { mapXenditToGenericPaymentBaseCallbackDto } from '../xendit-payment-base-callback-dto-mapper.helper';
import {
  mapXenditToGenericPaymentDetailAuthenticationDataDto,
  mapXenditToGenericPaymentDetailAuthorizationDataDto,
} from '../xendit-payment-shared-field-dto-mapper.helper';

export function mapXenditToGenericPaymentDetailsDto(
  payload: XenditPaymentDetailDto,
): PaymentDetailDto {
  if (!payload) {
    return;
  }

  return {
    authorizationData: mapXenditToGenericPaymentDetailAuthorizationDataDto(
      payload.authorization_data,
    ),
    authenticationData: mapXenditToGenericPaymentDetailAuthenticationDataDto(
      payload.authentication_data,
    ),
    issuerName: payload.issuer_name,
    senderAccountNumber: payload.sender_account_number,
    senderName: payload.sender_name,
    receiptId: payload.receipt_id,
    remark: payload.remark,
    network: payload.network,
    fundSource: payload.fund_source,
  };
}

export function mapXenditToGenericPaymentCaptureDto(
  payload: XenditPaymentCaptureDto[],
): PaymentCaptureDto[] {
  if (!payload || !payload.length) {
    return;
  }

  return payload.map((item) => ({
    captureTimestamp: item.capture_timestamp,
    captureId: item.capture_id,
    captureAmount: item.capture_amount,
  }));
}

export function mapXenditToGenericPaymentRequestCallbackDataDto(
  payload: XenditPaymentRequestCallbackDataDto,
): PaymentRequestCallbackDataDto {
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

export function mapXenditToGenericPaymentRequestCallbackDto(
  payload: XenditPaymentRequestCallbackDto,
): PaymentRequestCallbackDto {
  if (!payload) {
    return;
  }

  const data = mapXenditToGenericPaymentRequestCallbackDataDto(payload.data);

  return mapXenditToGenericPaymentBaseCallbackDto<PaymentRequestCallbackDataDto>(
    { ...payload, data },
  );
}
