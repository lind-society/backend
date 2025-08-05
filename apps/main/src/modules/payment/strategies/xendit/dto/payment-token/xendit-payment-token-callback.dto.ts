import { IsOptional } from 'class-validator';
import {
  IXenditPaymentBaseCallbackDto,
  XenditPaymentBaseCallbackDto,
} from '../xendit-payment-base-webhook.dto';
import {
  IXenditPaymentTokenDto,
  XenditPaymentTokenDto,
} from './xendit-payment-token.dto';

export interface IXenditPaymentTokenCallbackDto
  extends IXenditPaymentBaseCallbackDto<IXenditPaymentTokenDto> {
  data: IXenditPaymentTokenDto;
}
export class XenditPaymentTokenCallbackDto
  extends XenditPaymentBaseCallbackDto<XenditPaymentTokenDto>
  implements IXenditPaymentTokenCallbackDto
{
  @IsOptional()
  data: XenditPaymentTokenDto;
}
