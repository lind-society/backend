import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
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

export interface IXenditCreatePaymentRequestDto {
  reference_id: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  request_amount: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_properties: IXenditChannelPropertiesDto;
  channel_code: string;
  description?: string;
  metadata?: Record<string, any>;
  items?: IXenditPaymentItemDto[];
  shipping_information?: IXenditShippingInformationDto;
}

export class XenditCreatePaymentRequestDto
  implements IXenditCreatePaymentRequestDto
{
  reference_id: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  request_amount: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_properties: XenditChannelPropertiesDto;
  channel_code: string;
  description?: string;
  metadata?: Record<string, any>;
  items?: XenditPaymentItemDto[];
  shipping_information?: XenditShippingInformationDto;
}
