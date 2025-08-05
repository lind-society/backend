import { IsOptional } from 'class-validator';
import {
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';
import { IPaymentTokenDto, PaymentTokenDto } from './payment-token.dto';

export interface IPaymentTokenCallbackDto
  extends IPaymentBaseCallbackDto<IPaymentTokenDto> {
  data: IPaymentTokenDto;
}
export class PaymentTokenCallbackDto
  extends PaymentBaseCallbackDto<PaymentTokenDto>
  implements IPaymentTokenCallbackDto
{
  @IsOptional()
  data: PaymentTokenDto;
}
