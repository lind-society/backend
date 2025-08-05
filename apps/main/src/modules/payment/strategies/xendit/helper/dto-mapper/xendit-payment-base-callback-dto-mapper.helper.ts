import { PaymentBaseCallbackDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentBaseCallbackDto } from '../../dto';

export function mapXenditToGenericPaymentBaseCallbackDto<Data>(
  payload: XenditPaymentBaseCallbackDto<Data>,
): PaymentBaseCallbackDto<Data> {
  if (!payload) {
    return;
  }

  return {
    event: payload.event,
    businessId: payload.business_id,
    created: payload.created,
    apiVersion: payload.api_version,
    data: payload.data,
  };
}
