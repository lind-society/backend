import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
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
} from '../payment-shared-field.dto';
import {
  IShippingInformationDto,
  ShippingInformationDto,
} from './shared-payment-request-field.dto';

export interface ICreatePaymentRequestDto {
  referenceId?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requestAmount?: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelProperties?: IChannelPropertiesDto;
  channelCode: string;
  description?: string;
  metadata?: Record<string, any>;
  items?: IPaymentItemDto[];
  shippingInformation?: IShippingInformationDto;
}

export class CreatePaymentRequestDto implements ICreatePaymentRequestDto {
  @IsString()
  @IsOptional()
  referenceId: string;

  @IsEnum(PaymentAvailableType, {
    message: `payment type must be one of: ${Object.values(PaymentAvailableType).join(', ')}`,
  })
  @IsOptional()
  type?: PaymentAvailableType;

  @IsEnum(PaymentAvailableCountry, {
    message: `payment country must be one of: ${Object.values(PaymentAvailableCountry).join(', ')}`,
  })
  @IsOptional()
  country?: PaymentAvailableCountry;

  @IsEnum(PaymentAvailableCurrency, {
    message: `payment currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  currency?: PaymentAvailableCurrency;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'request amount must be a valid number' },
  )
  @Min(0, { message: 'minimum request amount is 0' })
  @IsOptional()
  requestAmount?: number;

  @IsEnum(PaymentAvailableCaptureMethod, {
    message: `payment capture method must be one of: ${Object.values(PaymentAvailableCaptureMethod).join(', ')}`,
  })
  @IsOptional()
  captureMethod?: PaymentAvailableCaptureMethod;

  @ValidateNested({ each: true })
  @Type(() => ChannelPropertiesDto)
  @IsOptional()
  channelProperties?: ChannelPropertiesDto;

  @IsString()
  @IsOptional()
  channelCode: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  @IsOptional()
  items?: PaymentItemDto[];

  @ValidateNested({ each: true })
  @Type(() => ShippingInformationDto)
  @IsOptional()
  shippingInformation?: ShippingInformationDto;
}
