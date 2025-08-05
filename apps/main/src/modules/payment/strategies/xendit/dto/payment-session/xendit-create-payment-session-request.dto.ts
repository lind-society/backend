import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionType,
} from '../../../../enum';
import {
  IXenditCreatePaymentCustomerDto,
  XenditCreatePaymentCustomerDto,
} from '../customer';
import { IXenditPaymentItemDto, XenditPaymentItemDto } from '../item';
import {
  IXenditCardsSessionJSDto,
  IXenditpaymentLinkConfigurationDto,
  IXenditSessionChannelPropertiesDto,
  XenditCardsSessionJSDto,
  XenditPaymentLinkConfigurationDto,
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
  capture_method?: PaymentAvailableCaptureMethod;
  country: PaymentAvailableCountry;
  channel_properties?: IXenditSessionChannelPropertiesDto;
  payment_link_configuration: IXenditpaymentLinkConfigurationDto;
  allowed_payment_channels?: string[];
  expires_at?: string;
  locale: string;
  metadata?: Record<string, any>;
  description?: string;
  items?: IXenditPaymentItemDto[];
  success_return_url?: string;
  cancel_return_url?: string;
  cards_session_js?: IXenditCardsSessionJSDto;
}

export class XenditCreatePaymentSessionDto
  implements IXenditCreatePaymentSessionDto
{
  reference_id: string;
  customer_id?: string;
  customer?: XenditCreatePaymentCustomerDto;
  session_type: PaymentAvailableSessionType;
  allow_save_payment_method?: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  mode: PaymentAvailableSessionMode;
  capture_method?: PaymentAvailableCaptureMethod;
  country: PaymentAvailableCountry;
  channel_properties?: XenditSessionChannelPropertiesDto;
  payment_link_configuration: XenditPaymentLinkConfigurationDto;
  allowed_payment_channels?: string[];
  expires_at?: string;
  locale: string;
  metadata?: Record<string, any>;
  description?: string;
  items?: XenditPaymentItemDto[];
  success_return_url?: string;
  cancel_return_url?: string;
  cards_session_js?: XenditCardsSessionJSDto;
}
