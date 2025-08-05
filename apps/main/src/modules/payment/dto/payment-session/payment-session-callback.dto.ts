import { IsOptional } from 'class-validator';
import {
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';
import { IPaymentSessionDto, PaymentSessionDto } from './payment-session.dto';

export interface IPaymentSessionCallbackDto
  extends IPaymentBaseCallbackDto<IPaymentSessionDto> {
  data: IPaymentSessionDto;
}
export class PaymentSessionCallbackDto
  extends PaymentBaseCallbackDto<PaymentSessionDto>
  implements IPaymentSessionCallbackDto
{
  @IsOptional()
  data: PaymentSessionDto;
}
