import { IsOptional } from 'class-validator';
import {
  IXenditPaymentBaseCallbackDto,
  XenditPaymentBaseCallbackDto,
} from '../xendit-payment-base-webhook.dto';
import {
  IXenditPaymentRefundDto,
  XenditPaymentRefundDto,
} from './xendit-payment-refund.dto';

export interface IXenditPaymentRefundCallbackDto
  extends IXenditPaymentBaseCallbackDto<IXenditPaymentRefundDto> {
  data: IXenditPaymentRefundDto;
}
export class XenditPaymentRefundCallbackDto
  extends XenditPaymentBaseCallbackDto<XenditPaymentRefundDto>
  implements IXenditPaymentRefundCallbackDto
{
  @IsOptional()
  data: XenditPaymentRefundDto;
}
