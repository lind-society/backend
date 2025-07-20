import { DefaultHttpStatus } from '@apps/main/common/enums';
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
} from '../../enum';
import {
  CardsSessionJSDto,
  ICardsSessionJSDto,
  ISessionChannelPropertiesDto,
  SessionChannelPropertiesDto,
} from './shared-card-payment-field.dto';

export interface IPaymentSessionDto {
  paymentSessionId: string;
  created: string;
  updated: string;
  referenceId: string;
  customerId: string;
  sessionType: PaymentAvailableSessionType;
  allowSavePaymentMethod: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  country: PaymentAvailableCountry;
  mode: PaymentAvailableSessionMode;
  channelProperties: ISessionChannelPropertiesDto;
  allowedPaymentChannels: string[];
  expiresAt: string;
  locale: string;
  metadata: Record<string, any>;
  successReturnUrl: string;
  cancelReturnUrl: string;
  status: PaymentAvailableSessionStatus;
  paymentLinkUrl: string;
  paymentTokenId: string;
  paymentRequestId: string;
  businessId: string;
  cardsSessionJS?: ICardsSessionJSDto;
}

export class PaymentSessionDto implements IPaymentSessionDto {
  paymentSessionId: string;
  created: string;
  updated: string;
  referenceId: string;
  customerId: string;
  sessionType: PaymentAvailableSessionType;
  allowSavePaymentMethod: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  country: PaymentAvailableCountry;
  mode: PaymentAvailableSessionMode;
  channelProperties: SessionChannelPropertiesDto;
  allowedPaymentChannels: string[];
  expiresAt: string;
  locale: string;
  metadata: Record<string, any>;
  successReturnUrl: string;
  cancelReturnUrl: string;
  status: PaymentAvailableSessionStatus;
  paymentLinkUrl: string;
  paymentTokenId: string;
  paymentRequestId: string;
  businessId: string;
  cardsSessionJS?: CardsSessionJSDto;
}

export class CreatePaymentSessionResponseSuccessResponse
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
