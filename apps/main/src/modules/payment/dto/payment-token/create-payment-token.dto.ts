import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentAvailableCountry, PaymentAvailableCurrency } from '../../enum';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import {
  ChannelPropertiesDto,
  IChannelPropertiesDto,
} from '../payment-shared-field.dto';

export interface ICreatePaymentTokenDto {
  channelCode: string;
  country: PaymentAvailableCountry;
  customerId?: string;
  customer?: IPaymentCustomerDto;
  referenceId: string;
  currency: PaymentAvailableCurrency;
  channelProperties: IChannelPropertiesDto;
  metadata?: Record<string, any>;
  description?: string;
}

export class CreatePaymentTokenDto implements ICreatePaymentTokenDto {
  @IsString()
  @IsNotEmpty()
  channelCode: string;

  @IsEnum(PaymentAvailableCountry, {
    message: `payment token country must be one of: ${Object.values(PaymentAvailableCountry).join(', ')}`,
  })
  @IsNotEmpty()
  country: PaymentAvailableCountry;

  @IsString()
  @IsOptional()
  customerId?: string;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerDto)
  @IsOptional()
  customer?: PaymentCustomerDto;

  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @IsEnum(PaymentAvailableCurrency, {
    message: `payment token currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsNotEmpty()
  currency: PaymentAvailableCurrency;

  @ValidateNested({ each: true })
  @Type(() => ChannelPropertiesDto)
  @IsNotEmpty()
  channelProperties: ChannelPropertiesDto;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;
}
