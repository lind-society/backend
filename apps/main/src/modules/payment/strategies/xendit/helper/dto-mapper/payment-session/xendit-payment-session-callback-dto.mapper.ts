import { PaymentSessionDto } from '@apps/main/modules/payment/dto';
import { PaymentSessionCallbackDto } from '@apps/main/modules/payment/dto/payment-session/payment-session-callback.dto';
import { XenditPaymentSessionCallbackDto } from '../../../dto';
import { mapXenditToGenericPaymentBaseCallbackDto } from '../xendit-payment-base-callback-dto-mapper.helper';
import { mapXenditToGenericPaymentSessionDto } from './xendit-payment-session-dto-mapper.dto';

export function mapXenditToGenericPaymentSessionCallbackDto(
  payload: XenditPaymentSessionCallbackDto,
): PaymentSessionCallbackDto {
  if (!payload) {
    return;
  }

  const data = mapXenditToGenericPaymentSessionDto(payload.data);

  return mapXenditToGenericPaymentBaseCallbackDto<PaymentSessionDto>({
    ...payload,
    data,
  });
}
