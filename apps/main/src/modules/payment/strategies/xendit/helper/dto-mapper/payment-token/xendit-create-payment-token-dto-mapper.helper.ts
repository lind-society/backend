import { CreatePaymentTokenDto } from '@apps/main/modules/payment/dto';
import { XenditCreatePaymentTokenDto } from '../../../dto';
import { mapGenericToXenditPaymentCustomerDto } from '../customer';
import { mapGenericToXenditChannelPropertiesDto } from '../xendit-payment-shared-field-dto-mapper.helper';

export function mapGenericToXenditCreatePaymentTokenDto(
  payload: CreatePaymentTokenDto,
): XenditCreatePaymentTokenDto {
  if (!payload) {
    return;
  }

  return {
    channel_code: payload.channelCode,
    country: payload.country,
    customer_id: payload.customerId,
    customer: mapGenericToXenditPaymentCustomerDto(payload.customer),
    reference_id: payload.referenceId,
    currency: payload.currency,
    channel_properties: mapGenericToXenditChannelPropertiesDto(
      payload.channelProperties,
    ),
    metadata: payload.metadata,
    description: payload.description,
  };
}
