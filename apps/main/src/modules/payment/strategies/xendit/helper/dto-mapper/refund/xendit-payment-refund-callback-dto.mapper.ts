import {
  PaymentRefundCallbackDto,
  PaymentRefundDto,
} from '@apps/main/modules/payment/dto/refund';
import { XenditPaymentRefundCallbackDto } from '../../../dto/refund/xendit-payment-refund-callback.dto';
import { mapXenditToGenericPaymentBaseCallbackDto } from '../xendit-payment-base-callback-dto-mapper.helper';
import { mapXenditToGenericPaymentRefundDto } from './xendit-payment-refund-dto-mapper.helper';

export function mapXenditToGenericPaymentRefundCallbackDto(
  payload: XenditPaymentRefundCallbackDto,
): PaymentRefundCallbackDto {
  if (!payload) {
    return;
  }

  const data = mapXenditToGenericPaymentRefundDto(payload.data);

  return mapXenditToGenericPaymentBaseCallbackDto<PaymentRefundDto>({
    ...payload,
    data,
  });
}
