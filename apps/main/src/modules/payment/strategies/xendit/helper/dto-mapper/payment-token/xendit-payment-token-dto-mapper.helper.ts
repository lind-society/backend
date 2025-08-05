import {
  PaymentTokenDetails,
  PaymentTokenDto,
} from '@apps/main/modules/payment/dto';
import { XenditPaymentTokenDetails, XenditPaymentTokenDto } from '../../../dto';
import {
  mapXenditToGenericChannelPropertiesDto,
  mapXenditToGenericPaymentActionDto,
  mapXenditToGenericPaymentDetailAuthenticationDataDto,
  mapXenditToGenericPaymentDetailAuthorizationDataDto,
} from '../xendit-payment-shared-field-dto-mapper.helper';

export function mapXenditToGenericTokenDetails(
  payload: XenditPaymentTokenDetails,
): PaymentTokenDetails {
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
    accountName: payload.account_number,
    accountBalance: payload.account_balance,
    accountPointBalance: payload.account_point_balance,
    accountNumber: payload.account_number,
  };
}

export function mapXenditToGenericPaymentTokenDto(
  payload: XenditPaymentTokenDto,
): PaymentTokenDto {
  if (!payload) {
    return;
  }

  return {
    paymentTokenId: payload.payment_token_id,
    channelCode: payload.channel_code,
    country: payload.country,
    businessId: payload.business_id,
    customerId: payload.customer_id,
    referenceId: payload.reference_id,
    currency: payload.currency,
    channelProperties: mapXenditToGenericChannelPropertiesDto(
      payload.channel_properties,
    ),
    actions: mapXenditToGenericPaymentActionDto(payload.actions),
    status: payload.status,
    tokenDetails: mapXenditToGenericTokenDetails(payload.token_details),
    failureCode: payload.failure_code,
    metadata: payload.metadata,
    description: payload.description,
    created: payload.created,
    updated: payload.updated,
  };
}
