import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableRequestStatus,
  PaymentAvailableType,
} from '@apps/main/modules/payment/enum';
import { IXenditPaymentItemDto, XenditPaymentItemDto } from '../item';
import {
  IXenditChannelPropertiesDto,
  XenditChannelPropertiesDto,
} from '../xendit-payment-shared-field.dto';
import {
  IXenditShippingInformationDto,
  XenditShippingInformationDto,
} from './xendit-shared-payment-request-field.dto';

export interface IXenditPaymentActionDto {
  type?: PaymentAvailableType;
  value?: string;
  descriptor?: string;
}

export interface IXenditPaymentRequestDto {
  business_id?: string;
  reference_id?: string;
  payment_request_id?: string;
  payment_token_id?: string;
  customer_id?: string;
  latest_payment_id?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  request_amount?: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_code?: string;
  channel_properties?: IXenditChannelPropertiesDto;
  actions?: IXenditPaymentActionDto[];
  status?: PaymentAvailableRequestStatus;
  failure_code?: PaymentAvailableFailureCode;
  description?: string;
  metadata?: Record<string, any>;
  items?: IXenditPaymentItemDto[];
  shipping_information?: IXenditShippingInformationDto;
  created?: string;
  updated?: string;
}

export class XenditPaymentActionDto implements IXenditPaymentActionDto {
  type?: PaymentAvailableType;
  value?: string;
  descriptor?: string;
}

export class XenditPaymentRequestDto implements IXenditPaymentRequestDto {
  business_id?: string;
  reference_id?: string;
  payment_request_id?: string;
  payment_token_id?: string;
  customer_id?: string;
  latest_payment_id?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  request_amount?: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_code?: string;
  channel_properties?: XenditChannelPropertiesDto;
  actions?: XenditPaymentActionDto[];
  status?: PaymentAvailableRequestStatus;
  failure_code?: PaymentAvailableFailureCode;
  description?: string;
  metadata?: Record<string, any>;
  items?: XenditPaymentItemDto[];
  shipping_information?: XenditShippingInformationDto;
  created?: string;
  updated?: string;
}
