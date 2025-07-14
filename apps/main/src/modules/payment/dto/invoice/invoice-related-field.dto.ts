import { InvoiceCustomerNotificationPreference } from '../../enum';

export interface IInvoiceCustomerNotificationPreferenceDto {
  invoiceCreated?: InvoiceCustomerNotificationPreference[];
  invoiceReminder?: InvoiceCustomerNotificationPreference[];
  invoicePaid?: InvoiceCustomerNotificationPreference[];
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
  allowedTerms: IInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export interface IInvoiceCardChannelPropertiesDto {
  allowedBins?: string[];
  installmentConfiguration: IInvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}

export class InvoiceCustomerNotificationPreferenceDto
  implements IInvoiceCustomerNotificationPreferenceDto
{
  invoiceCreated?: InvoiceCustomerNotificationPreference[];
  invoiceReminder?: InvoiceCustomerNotificationPreference[];
  invoicePaid?: InvoiceCustomerNotificationPreference[];
}

export class InvoiceFeeDto implements IInvoiceFeeDto {
  type: string;
  value: number;
}

export class InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
  implements IInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
{
  issuer: string;
  terms: number[];
}

export class InvoiceCardChannelPropertiesInstallmentConfigurationDto
  implements IInvoiceCardChannelPropertiesInstallmentConfigurationDto
{
  allowInstallment?: boolean;
  allowFullPayment?: boolean;
  allowedTerms: InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export class InvoiceCardChannelPropertiesDto
  implements IInvoiceCardChannelPropertiesDto
{
  allowedBins?: string[];
  installmentConfiguration: InvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}
