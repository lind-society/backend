import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  PaymentAllowSavePaymentMethod,
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionType,
} from '../../enum';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import { IPaymentItemDto, PaymentItemDto } from '../item';
import {
  CardsSessionJSDto,
  ICardsSessionJSDto,
  IpaymentLinkConfigurationDto,
  ISessionChannelPropertiesDto,
  PaymentLinkConfigurationDto,
  SessionChannelPropertiesDto,
} from './shared-card-payment-field.dto';

export interface ICreatePaymentSessionDto {
  referenceId: string;
  customerId?: string;
  customer?: IPaymentCustomerDto;
  sessionType: PaymentAvailableSessionType;
  allowSavePaymentMethod?: PaymentAllowSavePaymentMethod;
  currency: PaymentAvailableCurrency;
  amount: number;
  mode: PaymentAvailableSessionMode;
  captureMethod?: PaymentAvailableCaptureMethod;
  country: PaymentAvailableCountry;
  channelProperties?: ISessionChannelPropertiesDto;
  paymentLinkConfiguration?: IpaymentLinkConfigurationDto;
  allowedPaymentChannels?: string[];
  expiresAt?: string;
  locale?: string;
  metadata?: Record<string, any>;
  description?: string;
  items?: IPaymentItemDto[];
  successReturnUrl?: string;
  cancelReturnUrl?: string;
  cardsSessionJS?: ICardsSessionJSDto;
}

export class CreatePaymentSessionDto implements ICreatePaymentSessionDto {
  @IsString()
  @IsOptional()
  referenceId: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerDto)
  @IsOptional()
  customer?: PaymentCustomerDto;

  @IsEnum(PaymentAvailableSessionType, {
    message: `payment session type must be one of: ${Object.values(PaymentAvailableSessionType).join(', ')}`,
  })
  @IsOptional()
  sessionType: PaymentAvailableSessionType;

  @IsEnum(PaymentAllowSavePaymentMethod, {
    message: `payment session allowed save payment method must be one of: ${Object.values(PaymentAllowSavePaymentMethod).join(', ')}`,
  })
  @IsOptional()
  allowSavePaymentMethod?: PaymentAllowSavePaymentMethod;

  @IsEnum(PaymentAvailableCurrency, {
    message: `payment session currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  currency: PaymentAvailableCurrency;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'payment session amount must be a valid number' },
  )
  @Min(0, { message: 'minimum payment session amount is 0' })
  @IsOptional()
  amount: number;

  @IsEnum(PaymentAvailableSessionMode, {
    message: `payment session mode must be one of: ${Object.values(PaymentAvailableSessionMode).join(', ')}`,
  })
  @IsOptional()
  mode: PaymentAvailableSessionMode;

  @IsEnum(PaymentAvailableCaptureMethod, {
    message: `payment session capture method must be one of: ${Object.values(PaymentAvailableCaptureMethod).join(', ')}`,
  })
  @IsOptional()
  captureMethod: PaymentAvailableCaptureMethod;

  @IsEnum(PaymentAvailableCountry, {
    message: `payment session country must be one of: ${Object.values(PaymentAvailableCountry).join(', ')}`,
  })
  @IsOptional()
  country: PaymentAvailableCountry;

  @ValidateNested({ each: true })
  @Type(() => SessionChannelPropertiesDto)
  @IsOptional()
  channelProperties?: SessionChannelPropertiesDto;

  @ValidateNested({ each: true })
  @Type(() => PaymentLinkConfigurationDto)
  @IsOptional()
  paymentLinkConfiguration?: PaymentLinkConfigurationDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedPaymentChannels?: string[];

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  locale?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  @IsOptional()
  items?: PaymentItemDto[];

  @IsString()
  @IsOptional()
  successReturnUrl?: string;

  @IsString()
  @IsOptional()
  cancelReturnUrl?: string;

  @ValidateNested({ each: true })
  @Type(() => CardsSessionJSDto)
  @IsOptional()
  cardsSessionJS?: CardsSessionJSDto;
}
