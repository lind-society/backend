import { PaymentRequestDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentRequestDto } from '../../../dto/payment-request';
import { mapXenditToGenericPaymentItemsDto } from '../item';
import {
  mapXenditToGenericChannelPropertiesDto,
  mapXenditToGenericPaymentActionDto,
} from '../xendit-payment-shared-field-dto-mapper.helper';
import { mapXenditToGenericShippingConfiguration } from './xendit-shared-payment-field-dto-mapper.helper';

export function mapXenditToGenericPaymentRequestDto(
  payload: XenditPaymentRequestDto,
): PaymentRequestDto {
  if (!payload) {
    return;
  }

  return {
    businessId: payload.business_id,
    referenceId: payload.reference_id,
    paymentRequestId: payload.payment_request_id,
    paymentTokenId: payload.payment_token_id,
    customerId: payload.customer_id,
    latestPaymentId: payload.latest_payment_id,
    type: payload.type,
    country: payload.country,
    currency: payload.currency,
    requestAmount: payload.request_amount,
    captureMethod: payload.capture_method,
    channelCode: payload.channel_code,
    channelProperties: mapXenditToGenericChannelPropertiesDto(
      payload.channel_properties,
    ),
    actions: mapXenditToGenericPaymentActionDto(payload.actions),
    status: payload.status,
    failureCode: payload.failure_code,
    description: payload.description,
    metadata: payload.metadata,
    items: mapXenditToGenericPaymentItemsDto(payload.items),
    shippingInformation: mapXenditToGenericShippingConfiguration(
      payload.shipping_information,
    ),
    created: payload.created,
    updated: payload.updated,
  };
}
