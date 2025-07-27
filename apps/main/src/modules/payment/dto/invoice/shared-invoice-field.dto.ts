import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentAvailableCustomerNotificationPreference } from '../../enum';

export interface IPaymentAvailableCustomerNotificationPreferenceDto {
  invoiceCreated?: PaymentAvailableCustomerNotificationPreference[];
  invoiceReminder?: PaymentAvailableCustomerNotificationPreference[];
  invoicePaid?: PaymentAvailableCustomerNotificationPreference[];
}

export interface IInvoiceFeeDto {
  type: string;
  value: number;
}

export interface IInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto {
  issuer: string;
  terms: number[];
}

export interface IInvoiceCardChannelPropertiesInstallmentConfigurationDto {
  allowInstallment?: boolean;
  allowFullPayment?: boolean;
  allowedTerms?: IInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export interface IInvoiceCardChannelPropertiesDto {
  allowedBins?: string[];
  installmentConfiguration?: IInvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}

export class PaymentAvailableCustomerNotificationPreferenceDto
  implements IPaymentAvailableCustomerNotificationPreferenceDto
{
  @IsArray()
  @IsEnum(PaymentAvailableCustomerNotificationPreference, {
    each: true,
    message: `payment available customer notification for invoice created must be a list with value of either: ${Object.values(PaymentAvailableCustomerNotificationPreference).join(', ')}`,
  })
  @IsOptional()
  invoiceCreated?: PaymentAvailableCustomerNotificationPreference[];
  invoiceReminder?: PaymentAvailableCustomerNotificationPreference[];
  invoicePaid?: PaymentAvailableCustomerNotificationPreference[];
}

export class InvoiceFeeDto implements IInvoiceFeeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invoice fee value must be a valid number' },
  )
  @IsNotEmpty()
  value: number;
}

export class InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
  implements IInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
{
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @IsArray()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  @Min(0, {
    message:
      'minimum invoice channel properties installment configuration allowed term is 0',
  })
  @IsNotEmpty()
  terms: number[];
}

export class InvoiceCardChannelPropertiesInstallmentConfigurationDto
  implements IInvoiceCardChannelPropertiesInstallmentConfigurationDto
{
  @IsBoolean()
  @IsOptional()
  allowInstallment?: boolean;

  @IsBoolean()
  @IsOptional()
  allowFullPayment?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(
    () => InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
  )
  @IsOptional()
  allowedTerms?: InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export class InvoiceCardChannelPropertiesDto
  implements IInvoiceCardChannelPropertiesDto
{
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedBins?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceCardChannelPropertiesInstallmentConfigurationDto)
  @IsOptional()
  installmentConfiguration?: InvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}
