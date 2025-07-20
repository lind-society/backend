import { DefaultHttpStatus } from '@apps/main/common/enums';
import { PaymentSessionDto } from '@apps/main/modules/payment/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionStatus,
  PaymentAvailableSessionType,
} from '../../../../enum';
import {
  IXenditCardsSessionJSDto,
  IXenditSessionChannelPropertiesDto,
  XenditCardsSessionJSDto,
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
  channel_properties: IXenditSessionChannelPropertiesDto;
  allowed_payment_channels: string[];
  expires_at: string;
  locale: string;
  metadata: Record<string, any>;
  success_return_url: string;
  cancel_return_url: string;
  status: PaymentAvailableSessionStatus;
  payment_link_url: string;
  payment_token_id: string;
  payment_request_id: string;
  business_id: string;
  cards_session_js?: IXenditCardsSessionJSDto;
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
  channel_properties: XenditSessionChannelPropertiesDto;
  allowed_payment_channels: string[];
  expires_at: string;
  locale: string;
  metadata: Record<string, any>;
  success_return_url: string;
  cancel_return_url: string;
  status: PaymentAvailableSessionStatus;
  payment_link_url: string;
  payment_token_id: string;
  payment_request_id: string;
  business_id: string;
  cards_session_js?: XenditCardsSessionJSDto;
}

export class CreatePaymentSessionSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentSessionDto>
{
  readonly data: PaymentSessionDto;

  constructor(data: PaymentSessionDto) {
    super({
      code: HttpStatus.OK,
      message: 'create payment session success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
