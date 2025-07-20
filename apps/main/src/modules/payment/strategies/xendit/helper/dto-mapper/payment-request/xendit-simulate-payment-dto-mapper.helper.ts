import {
  CreateSimulatePaymentDto,
  SimulatePaymentDto,
} from '@apps/main/modules/payment/dto';
import {
  XenditCreateSimulatePaymentDto,
  XenditSimulatePaymentDto,
} from '../../../dto/payment-request';

export function mapGenericToXenditCreateSimulatePaymentDto(
  payload: CreateSimulatePaymentDto,
): XenditCreateSimulatePaymentDto {
  return {
    amount: payload.amount,
  };
}

export function mapXenditToGenericSimulatePaymentDto(
  payload: XenditSimulatePaymentDto,
): SimulatePaymentDto {
  return {
    status: payload.status,
    message: payload.message,
  };
}
