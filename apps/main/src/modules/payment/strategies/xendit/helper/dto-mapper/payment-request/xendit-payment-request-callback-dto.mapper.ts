import {
  PaymentRequestCallbackCaptureDto,
  PaymentRequestCallbackDataDto,
  PaymentRequestCallbackDto,
  PaymentRequestCallbackPaymentDetailAuthenticationDataAResDto,
  PaymentRequestCallbackPaymentDetailAuthenticationDataDto,
  PaymentRequestCallbackPaymentDetailAuthorizationDataDto,
  PaymentRequestCallbackPaymentDetailDto,
} from '@apps/main/modules/payment/dto';
import {
  XenditPaymentRequestCallbackCaptureDto,
  XenditPaymentRequestCallbackDataDto,
  XenditPaymentRequestCallbackDto,
  XenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto,
  XenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto,
  XenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto,
  XenditPaymentRequestCallbackPaymentDetailDto,
} from '../../../dto/payment-request';

export function mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto(
  payload: XenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto,
): PaymentRequestCallbackPaymentDetailAuthenticationDataAResDto {
  if (!payload) {
    return;
  }

  return {
    eci: payload.eci,
    messageVersion: payload.message_version,
    authenticationValue: payload.authentication_value,
    dsTransId: payload.ds_trans_id,
  };
}

export function mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthorizationDataDto(
  payload: XenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto,
): PaymentRequestCallbackPaymentDetailAuthorizationDataDto {
  if (!payload) {
    return;
  }

  return {
    authorizationCode: payload.authorization_code,
    cvnVerificationResult: payload.cvn_verification_result,
    addressVerificationResult: payload.address_verification_result,
    retrievalReferenceNumber: payload.retrieval_reference_number,
    networkResponseCode: payload.network_response_code,
    networkResponseCodeDescriptor: payload.network_response_code_descriptor,
    networkTransactionId: payload.network_transaction_id,
    acquirerMerchantId: payload.acquirer_merchant_id,
    reconciliationId: payload.reconciliation_id,
  };
}

export function mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthenticationDataDto(
  payload: XenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto,
): PaymentRequestCallbackPaymentDetailAuthenticationDataDto {
  if (!payload) {
    return;
  }

  return {
    flow: payload.flow,
    aRes: mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto(
      payload.a_res,
    ),
  };
}

export function mapXenditToGenericPaymentRequestCallbackPaymentDetailsDto(
  payload: XenditPaymentRequestCallbackPaymentDetailDto,
): PaymentRequestCallbackPaymentDetailDto {
  if (!payload) {
    return;
  }

  return {
    authorizationData:
      mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthorizationDataDto(
        payload.authorization_data,
      ),
    authenticationData:
      mapXenditToGenericPaymentRequestCallbackPaymentDetailAuthenticationDataDto(
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

export function mapXenditToGenericPaymentRequestCallbackCaptureDto(
  payload: XenditPaymentRequestCallbackCaptureDto[],
): PaymentRequestCallbackCaptureDto[] {
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
    captures: mapXenditToGenericPaymentRequestCallbackCaptureDto(
      payload.captures,
    ),
    status: payload.status,
    paymentDetails: mapXenditToGenericPaymentRequestCallbackPaymentDetailsDto(
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

  return {
    event: payload.event,
    businessId: payload.business_id,
    created: payload.created,
    data: mapXenditToGenericPaymentRequestCallbackDataDto(payload.data),
    apiVersion: payload.api_version,
  };
}
