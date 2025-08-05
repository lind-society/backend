import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableRequestStatus,
  PaymentAvailableType,
} from '../../enum';
import { IPaymentItemDto, PaymentItemDto } from '../item';
import {
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';
import {
  ChannelPropertiesDto,
  IChannelPropertiesDto,
} from '../payment-shared-field.dto';
import {
  IShippingInformationDto,
  ShippingInformationDto,
} from './shared-payment-request-field.dto';

export interface IPaymentActionDto {
  type?: PaymentAvailableType;
  value?: string;
  descriptor?: string;
}

export interface IPaymentRequestDto {
  businessId?: string;
  referenceId?: string;
  paymentRequestId?: string;
  paymentTokenId?: string;
  customerId?: string;
  latestPaymentId?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requestAmount?: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelCode?: string;
  channelProperties?: IChannelPropertiesDto;
  actions?: IPaymentActionDto[];
  status?: PaymentAvailableRequestStatus;
  failureCode?: PaymentAvailableFailureCode;
  description?: string;
  metadata?: Record<string, any>;
  items?: IPaymentItemDto[];
  shippingInformation?: IShippingInformationDto;
  created?: string;
  updated?: string;
}

export interface IPaymentRequestWebhookDto
  extends IPaymentBaseCallbackDto<IPaymentRequestDto> {
  data: IPaymentRequestDto;
}

export class PaymentActionDto implements IPaymentActionDto {
  type?: PaymentAvailableType;
  value?: string;
  descriptor?: string;
}

export class PaymentRequestDto implements IPaymentRequestDto {
  businessId?: string;
  referenceId?: string;
  paymentRequestId?: string;
  paymentTokenId?: string;
  customerId?: string;
  latestPaymentId?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requestAmount?: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelCode?: string;
  channelProperties?: ChannelPropertiesDto;
  actions?: PaymentActionDto[];
  status?: PaymentAvailableRequestStatus;
  failureCode?: PaymentAvailableFailureCode;
  description?: string;
  metadata?: Record<string, any>;
  items?: PaymentItemDto[];
  shippingInformation?: ShippingInformationDto;
  created?: string;
  updated?: string;
}

export class PaymentRequestWebhookDto
  extends PaymentBaseCallbackDto<PaymentRequestDto>
  implements IPaymentRequestWebhookDto
{
  data: PaymentRequestDto;
}

export class CreatePaymentRequestSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentRequestDto>
{
  readonly data: PaymentRequestDto;

  constructor(data: PaymentRequestDto) {
    super({
      code: HttpStatus.OK,
      message: 'create payment request success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class CancelPaymentRequestSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentRequestDto>
{
  readonly data: PaymentRequestDto;

  constructor(data: PaymentRequestDto) {
    super({
      code: HttpStatus.OK,
      message: 'cancel payment request success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
