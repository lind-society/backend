import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionStatus,
  PaymentAvailableSessionType,
} from '../../enum';
import { PaymentItemDto } from '../item';
import {
  CardsSessionJSDto,
  ICardsSessionJSDto,
  IpaymentLinkConfigurationDto,
  ISessionChannelPropertiesDto,
  PaymentLinkConfigurationDto,
  SessionChannelPropertiesDto,
} from './shared-card-payment-field.dto';

/**
 * This is a result dto so validation is not needed
 */

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
  captureMethod: PaymentAvailableCaptureMethod;
  channelProperties: ISessionChannelPropertiesDto;
  paymentLinkConfiguration?: IpaymentLinkConfigurationDto;
  allowedPaymentChannels: string[];
  expiresAt: string;
  locale: string;
  metadata: Record<string, any>;
  description: string;
  items: PaymentItemDto[];
  successReturnUrl: string;
  cancelReturnUrl: string;
  status: PaymentAvailableSessionStatus;
  paymentLinkUrl: string;
  paymentTokenId: string;
  paymentId: string;
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
  captureMethod: PaymentAvailableCaptureMethod;
  channelProperties: SessionChannelPropertiesDto;
  paymentLinkConfiguration?: PaymentLinkConfigurationDto;
  allowedPaymentChannels: string[];
  expiresAt: string;
  locale: string;
  metadata: Record<string, any>;
  description: string;
  items: PaymentItemDto[];
  successReturnUrl: string;
  cancelReturnUrl: string;
  status: PaymentAvailableSessionStatus;
  paymentLinkUrl: string;
  paymentTokenId: string;
  paymentId: string;
  paymentRequestId: string;
  businessId: string;
  cardsSessionJS?: CardsSessionJSDto;
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

export class CancelPaymentSessionSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentSessionDto>
{
  readonly data: PaymentSessionDto;

  constructor(data: PaymentSessionDto) {
    super({
      code: HttpStatus.OK,
      message: 'cancel payment session success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

/* deprecated 
export class PaymentSessionSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentSessionDto>
{
  readonly data: PaymentSessionDto;

  constructor(action: string, data: PaymentSessionDto) {
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
