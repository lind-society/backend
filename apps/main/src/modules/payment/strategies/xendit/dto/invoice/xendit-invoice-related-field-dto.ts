import { XenditInvoiceCustomerNotificationPreference } from '../../enum';

export interface IXenditInvoiceCustomerNotificationPreferenceDto {
  invoice_created?: XenditInvoiceCustomerNotificationPreference[];
  invoice_reminder?: XenditInvoiceCustomerNotificationPreference[];
  invoice_paid?: XenditInvoiceCustomerNotificationPreference[];
}

export interface IXenditInvoiceFeeDto {
  type: string;
  value: number;
}

export interface IXenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto {
  issuer: string;
  terms: number[];
}

export interface IXenditInvoiceCardChannelPropertiesInstallmentConfigurationDto {
  allow_installment?: boolean;
  allow_full_payment?: boolean;
  allowed_terms: IXenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export interface IXenditInvoiceCardChannelPropertiesDto {
  allowed_bins?: string[];
  installment_configuration: IXenditInvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}

export class XenditInvoiceCustomerNotificationPreferenceDto
  implements IXenditInvoiceCustomerNotificationPreferenceDto
{
  invoice_created?: XenditInvoiceCustomerNotificationPreference[];
  invoice_reminder?: XenditInvoiceCustomerNotificationPreference[];
  invoice_paid?: XenditInvoiceCustomerNotificationPreference[];
}

export class XenditInvoiceFeeDto implements IXenditInvoiceFeeDto {
  type: string;
  value: number;
}

export class XenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
  implements
    IXenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto
{
  issuer: string;
  terms: number[];
}

export class XenditInvoiceCardChannelPropertiesInstallmentConfigurationDto
  implements IXenditInvoiceCardChannelPropertiesInstallmentConfigurationDto
{
  allow_installment?: boolean;
  allow_full_payment?: boolean;
  allowed_terms: IXenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto[];
}

export class XenditInvoiceCardChannelPropertiesDto
  implements IXenditInvoiceCardChannelPropertiesDto
{
  allowed_bins?: string[];
  installment_configuration: IXenditInvoiceCardChannelPropertiesInstallmentConfigurationDto[];
}
