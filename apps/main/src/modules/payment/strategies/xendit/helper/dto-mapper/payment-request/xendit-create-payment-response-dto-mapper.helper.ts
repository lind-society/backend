import {
  PaymentActionDto,
  PaymentRequestDto,
} from '@apps/main/modules/payment/dto';
import {
  XenditPaymentActionDto,
  XenditPaymentRequestDto,
} from '../../../dto/payment-request';
import { mapXenditToGenericPaymentItemsDto } from '../item';
import {
  mapXenditToGenericChannelPropertiesDto,
  mapXenditToGenericShippingConfiguration,
} from './xendit-shared-payment-field-dto-mapper.helper';

export function mapXenditToGenericPaymentPaymentActionDto(
  payload: XenditPaymentActionDto[],
): PaymentActionDto[] {
  return payload.map((item) => ({
    type: item.type,
    value: item.value,
    descriptor: item.descriptor,
  }));
}
// Generic to Xendit
export function mapXenditToGenericPaymentRequestDto(
  payload: XenditPaymentRequestDto,
): PaymentRequestDto {
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
    actions: mapXenditToGenericPaymentPaymentActionDto(payload.actions),
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
