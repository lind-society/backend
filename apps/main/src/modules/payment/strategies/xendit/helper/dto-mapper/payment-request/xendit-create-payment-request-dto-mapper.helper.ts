import { CreatePaymentRequestDto } from '@apps/main/modules/payment/dto';
import { XenditCreatePaymentRequestDto } from '../../../dto/payment-request';
import { mapGenericToXenditPaymentItemsDto } from '../item';
import { mapGenericToXenditChannelPropertiesDto } from '../xendit-payment-shared-field-dto-mapper.helper';
import { mapGenericToXenditShippingConfiguration } from './xendit-shared-payment-field-dto-mapper.helper';

export function mapGenericToXenditCreatePaymentRequestDto(
  payload: CreatePaymentRequestDto,
): XenditCreatePaymentRequestDto {
  return {
    reference_id: payload.referenceId,
    type: payload.type,
    country: payload.country,
    currency: payload.currency,
    request_amount: payload.requestAmount,
    capture_method: payload.captureMethod,
    channel_properties: mapGenericToXenditChannelPropertiesDto(
      payload.channelProperties,
    ),
    channel_code: payload.channelCode,
    description: payload.description,
    metadata: payload.metadata,
    items: mapGenericToXenditPaymentItemsDto(payload.items),
    shipping_information: mapGenericToXenditShippingConfiguration(
      payload.shippingInformation,
    ),
  };
}
