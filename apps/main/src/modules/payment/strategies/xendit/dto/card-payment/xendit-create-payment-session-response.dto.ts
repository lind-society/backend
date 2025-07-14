import {
  IXenditCardSessionJsDto,
  XenditCardSessionJsDto,
} from './xendit-card-session-js.dto';

export interface IXenditCreatePaymentSessionResponseDto {
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  currency: string;
  amount: number;
  country: string;
  customer_id: string;
  expires_at: string;
  session_type: string;
  mode: string;
  locale: string;
  business_id: string;
  cards_session_js: IXenditCardSessionJsDto;
}

export class XenditCreatePaymentSessionResponseDto
  implements IXenditCreatePaymentSessionResponseDto
{
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  currency: string;
  amount: number;
  country: string;
  customer_id: string;
  expires_at: string;
  session_type: string;
  mode: string;
  locale: string;
  business_id: string;
  cards_session_js: XenditCardSessionJsDto;
}
