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
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableSessionMode,
  PaymentAvailableSessionType,
} from '../../enum';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import {
  CardsSessionJSDto,
  ICardsSessionJSDto,
  ISessionChannelPropertiesDto,
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
  country: PaymentAvailableCountry;
  channelProperties?: ISessionChannelPropertiesDto;
  allowedPaymentChannels?: string[];
  expiresAt?: string;
  locale?: string;
  metadata?: Record<string, any>;
  description?: string;
  successReturnUrl?: string;
  cancelReturnUrl?: string;
  cardsSessionJS?: ICardsSessionJSDto;
}

export class CreatePaymentSessionDto implements ICreatePaymentSessionDto {
  @IsString()
  @IsNotEmpty()
  referenceId: string;
  customerId?: string;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerDto)
  @IsOptional()
  customer?: PaymentCustomerDto;

  @IsEnum(PaymentAvailableSessionType, {
    message: `payment session type must be one of: ${Object.values(PaymentAvailableSessionType).join(', ')}`,
  })
  @IsNotEmpty()
  sessionType: PaymentAvailableSessionType;
  allowSavePaymentMethod?: PaymentAllowSavePaymentMethod;

  @IsEnum(PaymentAvailableCurrency, {
    message: `payment session currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsNotEmpty()
  currency: PaymentAvailableCurrency;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'payment session amount must be a valid number' },
  )
  @Min(0, { message: 'minimum payment session amount is 0' })
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentAvailableSessionMode, {
    message: `payment session mode must be one of: ${Object.values(PaymentAvailableSessionMode).join(', ')}`,
  })
  @IsNotEmpty()
  mode: PaymentAvailableSessionMode;

  @IsEnum(PaymentAvailableCountry, {
    message: `payment session country must be one of: ${Object.values(PaymentAvailableCountry).join(', ')}`,
  })
  @IsNotEmpty()
  country: PaymentAvailableCountry;

  @ValidateNested({ each: true })
  @Type(() => SessionChannelPropertiesDto)
  @IsOptional()
  channelProperties?: SessionChannelPropertiesDto;

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
