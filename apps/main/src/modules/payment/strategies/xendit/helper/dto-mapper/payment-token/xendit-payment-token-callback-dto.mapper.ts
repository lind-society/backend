import {
  PaymentTokenCallbackDto,
  PaymentTokenDto,
} from '@apps/main/modules/payment/dto';
import { XenditPaymentTokenCallbackDto } from '../../../dto';
import { mapXenditToGenericPaymentBaseCallbackDto } from '../xendit-payment-base-callback-dto-mapper.helper';
import { mapXenditToGenericPaymentTokenDto } from './xendit-payment-token-dto-mapper.helper';

export function mapXenditToGenericPaymentTokenCallbackDto(
  payload: XenditPaymentTokenCallbackDto,
): PaymentTokenCallbackDto {
  if (!payload) {
    return;
  }

  const data = mapXenditToGenericPaymentTokenDto(payload.data);

  return mapXenditToGenericPaymentBaseCallbackDto<PaymentTokenDto>({
    ...payload,
    data,
  });
}
