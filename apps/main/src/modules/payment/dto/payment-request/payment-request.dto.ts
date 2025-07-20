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
  IPaymentBaseWebhookDto,
  PaymentBaseWebhookDto,
} from '../payment-base-webhook.dto';
import {
  ChannelPropertiesDto,
  IChannelPropertiesDto,
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
  extends IPaymentBaseWebhookDto<IPaymentRequestDto> {
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
  extends PaymentBaseWebhookDto<PaymentRequestDto>
  implements IPaymentRequestWebhookDto
{
  data: PaymentRequestDto;
}
