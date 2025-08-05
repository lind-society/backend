import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionStatus,
  PaymentAvailableSessionType,
} from '../../../../enum';
import { IXenditPaymentItemDto, XenditPaymentItemDto } from '../item';
import {
  IXenditCardsSessionJSDto,
  IXenditpaymentLinkConfigurationDto,
  IXenditSessionChannelPropertiesDto,
  XenditCardsSessionJSDto,
  XenditPaymentLinkConfigurationDto,
  XenditSessionChannelPropertiesDto,
} from './xendit-shared-card-payment-field.dto';

export interface IXenditPaymentSessionDto {
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  customer_id: string;
  session_type: PaymentAvailableSessionType;
  allow_save_payment_method: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  country: PaymentAvailableCountry;
  mode: PaymentAvailableSessionMode;
  capture_method: PaymentAvailableCaptureMethod;
  channel_properties: IXenditSessionChannelPropertiesDto;
  payment_link_configuration: IXenditpaymentLinkConfigurationDto;
  allowed_payment_channels: string[];
  expires_at: string;
  locale: string;
  metadata: Record<string, any>;
  description: string;
  items: IXenditPaymentItemDto[];
  success_return_url: string;
  cancel_return_url: string;
  status: PaymentAvailableSessionStatus;
  payment_link_url: string;
  payment_token_id: string;
  payment_id: string;
  payment_request_id: string;
  business_id: string;
  cards_session_js: IXenditCardsSessionJSDto;
}

export class XenditPaymentSessionDto implements IXenditPaymentSessionDto {
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  customer_id: string;
  session_type: PaymentAvailableSessionType;
  allow_save_payment_method: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  country: PaymentAvailableCountry;
  mode: PaymentAvailableSessionMode;
  capture_method: PaymentAvailableCaptureMethod;
  channel_properties: XenditSessionChannelPropertiesDto;
  payment_link_configuration: XenditPaymentLinkConfigurationDto;
  allowed_payment_channels: string[];
  expires_at: string;
  locale: string;
  metadata: Record<string, any>;
  description: string;
  items: XenditPaymentItemDto[];
  success_return_url: string;
  cancel_return_url: string;
  status: PaymentAvailableSessionStatus;
  payment_link_url: string;
  payment_token_id: string;
  payment_id: string;
  payment_request_id: string;
  business_id: string;
  cards_session_js: XenditCardsSessionJSDto;
}

/* deprecated
export class XenditPaymentSessionSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<XenditPaymentSessionDto>
{
  readonly data: XenditPaymentSessionDto;

  constructor(action: string, data: XenditPaymentSessionDto) {
    super({
      code: HttpStatus.OK,
      message:
        action !== 'get'
          ? `${action} payment session success`
          : `${action} payment session detail success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
*/
