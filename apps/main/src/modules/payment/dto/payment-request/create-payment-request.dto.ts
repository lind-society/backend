import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableType,
} from '../../enum';
import { IPaymentItemDto, PaymentItemDto } from '../item';
import {
  ChannelPropertiesDto,
  IChannelPropertiesDto,
  IShippingInformationDto,
  ShippingInformationDto,
} from './shared-payment-request-field.dto';

export interface ICreatePaymentRequestDto {
  referenceId: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  requestAmount: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelProperties: IChannelPropertiesDto;
  channelCode: string;
  description?: string;
  metadata?: Record<string, any>;
  items?: IPaymentItemDto[];
  shippingInformation?: IShippingInformationDto;
}

export class CreatePaymentRequestDto implements ICreatePaymentRequestDto {
  referenceId: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  requestAmount: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelProperties: ChannelPropertiesDto;
  channelCode: string;
  description?: string;
  metadata?: Record<string, any>;
  items?: PaymentItemDto[];
  shippingInformation?: ShippingInformationDto;
}
