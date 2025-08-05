import { IsOptional } from 'class-validator';
import {
  IXenditPaymentBaseCallbackDto,
  XenditPaymentBaseCallbackDto,
} from '../xendit-payment-base-webhook.dto';
import {
  IXenditPaymentSessionDto,
  XenditPaymentSessionDto,
} from './xendit-payment-session.dto';

export interface IXenditPaymentSessionCallbackDto
  extends IXenditPaymentBaseCallbackDto<IXenditPaymentSessionDto> {
  data: IXenditPaymentSessionDto;
}
export class XenditPaymentSessionCallbackDto
  extends XenditPaymentBaseCallbackDto<XenditPaymentSessionDto>
  implements IXenditPaymentSessionCallbackDto
{
  @IsOptional()
  data: XenditPaymentSessionDto;
}
