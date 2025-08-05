import { IsOptional } from 'class-validator';
import {
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';
import { IPaymentRefundDto, PaymentRefundDto } from './payment-refund.dto';

export interface IPaymentRefundCallbackDto
  extends IPaymentBaseCallbackDto<IPaymentRefundDto> {
  data: IPaymentRefundDto;
}
export class PaymentRefundCallbackDto
  extends PaymentBaseCallbackDto<PaymentRefundDto>
  implements IPaymentRefundCallbackDto
{
  @IsOptional()
  data: PaymentRefundDto;
}
