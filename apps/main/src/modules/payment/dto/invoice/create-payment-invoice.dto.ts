import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import {
  PaymentAvailableCurrency,
  PaymentAvailableLanguage,
  PaymentAvailableReminderTimeUnit,
} from '../../enum';
import { InvoiceReminderTimeValidator } from '../../helper';
import { PaymentItemNetUnitAmountValidator } from '../../helper/dto-custom-validator/payment-item-type-dto-custom-validator.helper';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import { IPaymentItemDto, PaymentItemDto } from '../item';
import {
  IInvoiceCardChannelPropertiesDto,
  IInvoiceFeeDto,
  InvoiceCardChannelPropertiesDto,
  InvoiceFeeDto,
  IPaymentAvailableCustomerNotificationPreferenceDto,
  PaymentAvailableCustomerNotificationPreferenceDto,
} from './shared-invoice-field.dto';

export interface ICreatePaymentInvoiceDto {
  externalId: string;
  amount: number;
  description?: string;
  customer?: IPaymentCustomerDto;
  customerNotificationPreference?: IPaymentAvailableCustomerNotificationPreferenceDto;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency?: PaymentAvailableCurrency;
  callbackVirtualAccountId?: string;
  mid_label?: string;
  reminderTimeUnit?: PaymentAvailableReminderTimeUnit;
  reminderTime?: number;
  locale?: PaymentAvailableLanguage;
  items?: IPaymentItemDto[];
  fees?: IInvoiceFeeDto[];
  shouldAuthenticateCreditCard?: boolean;
  channelProperties?: IInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}

export class CreatePaymentInvoiceDto implements ICreatePaymentInvoiceDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'amount must be a valid number' },
  )
  @Min(0, { message: 'minimum amount is 0' })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerDto)
  @IsOptional()
  customer?: PaymentCustomerDto;

  @ValidateNested({ each: true })
  @Type(() => PaymentAvailableCustomerNotificationPreferenceDto)
  @IsOptional()
  customerNotificationPreference?: PaymentAvailableCustomerNotificationPreferenceDto;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invoice duration must be a valid number' },
  )
  @Min(1, { message: 'minimum invoice duration is 1 second' })
  @Max(31536000, {
    message: 'minimum invoice duration is 31.536.000 second (1 year)',
  })
  @IsOptional()
  invoiceDuration?: number; // in seconds, to do (optional) enchance to be set by minute or hour

  @IsString()
  @IsOptional()
  successRedirectUrl?: string;

  @IsString()
  @IsOptional()
  failureRedirectUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  paymentMethods?: string[];

  @IsEnum(PaymentAvailableCurrency, {
    message: `currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  currency?: PaymentAvailableCurrency;

  @IsString()
  @IsOptional()
  callbackVirtualAccountId?: string;

  @IsString()
  @IsOptional()
  midLabel?: string;

  @IsEnum(PaymentAvailableCurrency, {
    message: `currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  reminderTimeUnit?: PaymentAvailableReminderTimeUnit;

  @Validate(InvoiceReminderTimeValidator)
  reminderTime?: number;

  @IsEnum(PaymentAvailableLanguage, {
    message: `locale must be one of: ${Object.values(PaymentAvailableLanguage).join(', ')}`,
  })
  @IsOptional()
  locale?: PaymentAvailableLanguage;

  @IsArray()
  @ValidateNested({ each: true })
  @Validate(PaymentItemNetUnitAmountValidator)
  items?: PaymentItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceFeeDto)
  @IsOptional()
  fees?: InvoiceFeeDto[];

  @IsBoolean()
  @IsOptional()
  shouldAuthenticateCreditCard?: boolean;

  @ValidateNested({ each: true })
  @Type(() => InvoiceCardChannelPropertiesDto)
  @IsOptional()
  channelProperties?: InvoiceCardChannelPropertiesDto;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
