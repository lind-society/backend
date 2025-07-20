import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionType,
} from '../../../../enum';
import { IXenditCreatePaymentCustomerDto } from '../customer';
import {
  IXenditCardsSessionJSDto,
  IXenditSessionChannelPropertiesDto,
  XenditCardsSessionJSDto,
  XenditSessionChannelPropertiesDto,
} from './xendit-shared-card-payment-field.dto';

export interface IXenditCreatePaymentSessionDto {
  reference_id: string;
  customer_id?: string;
  customer?: IXenditCreatePaymentCustomerDto;
  session_type: PaymentAvailableSessionType;
  allow_save_payment_method?: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  mode: PaymentAvailableSessionMode;
  country: PaymentAvailableCountry;
  channel_properties?: IXenditSessionChannelPropertiesDto;
  allowed_payment_channels?: string[];
  expires_at?: string;
  locale: string;
  metadata?: Record<string, any>;
  description?: string;
  success_return_url?: string;
  cancel_return_url?: string;
  cards_session_js?: IXenditCardsSessionJSDto;
}

export class XenditCreatePaymentSessionDto
  implements IXenditCreatePaymentSessionDto
{
  reference_id: string;
  customer_id?: string;
  customer?: IXenditCreatePaymentCustomerDto;
  session_type: PaymentAvailableSessionType;
  allow_save_payment_method?: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  mode: PaymentAvailableSessionMode;
  country: PaymentAvailableCountry;
  channel_properties?: XenditSessionChannelPropertiesDto;
  allowed_payment_channels?: string[];
  expires_at?: string;
  locale: string;
  metadata?: Record<string, any>;
  description?: string;
  success_return_url?: string;
  cancel_return_url?: string;
  cards_session_js?: XenditCardsSessionJSDto;
}
