import {
  IXenditCustomerDto,
  XenditCustomerDto,
} from '../customer/xendit-customer.dto';
import {
  IXenditCardSessionJsDto,
  XenditCardSessionJsDto,
} from './xendit-card-session-js.dto';

export interface IXenditCreatePaymentSessionRequestDto {
  reference_id: string;
  session_type: string;
  mode: string;
  amount: number;
  currency: string;
  country: string;
  customer: IXenditCustomerDto;
  cards_session_js: IXenditCardSessionJsDto;
}

export class XenditCreatePaymentSessionRequestDto
  implements IXenditCreatePaymentSessionRequestDto
{
  reference_id: string;
  session_type: string;
  mode: string;
  amount: number;
  currency: string;
  country: string;
  customer: XenditCustomerDto;
  cards_session_js: XenditCardSessionJsDto;
}
