import {
  InvoiceCardChannelPropertiesDto,
  InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
  InvoiceCardChannelPropertiesInstallmentConfigurationDto,
  InvoiceCustomerNotificationPreferenceDto,
  InvoiceFeeDto,
} from '@apps/main/modules/payment/dto/invoice/invoice-related-field.dto';
import {
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
  XenditInvoiceCardChannelPropertiesInstallmentConfigurationDto,
  XenditInvoiceCustomerNotificationPreferenceDto,
  XenditInvoiceFeeDto,
} from '../../../dto/invoice';
import { mapXenditToGenericInvoiceCustomerNotificationPreference } from '../../enum-mapper/xendit-invoice-customer-notification-preference-enum-mapper.helper';

export function mapXenditToGenericInvoiceCustomerNotificationPreferenceDto(
  payload: XenditInvoiceCustomerNotificationPreferenceDto,
): InvoiceCustomerNotificationPreferenceDto {
  return {
    invoiceCreated: payload.invoice_created?.map(
      mapXenditToGenericInvoiceCustomerNotificationPreference,
    ),
    invoicePaid: payload.invoice_paid?.map(
      mapXenditToGenericInvoiceCustomerNotificationPreference,
    ),
    invoiceReminder: payload.invoice_reminder?.map(
      mapXenditToGenericInvoiceCustomerNotificationPreference,
    ),
  };
}

export function mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto(
  payload: XenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
): InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto {
  return {
    issuer: payload.issuer,
    terms: payload.terms,
  };
}

export function mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationDto(
  payload: XenditInvoiceCardChannelPropertiesInstallmentConfigurationDto,
): InvoiceCardChannelPropertiesInstallmentConfigurationDto {
  return {
    allowFullPayment: payload.allow_full_payment,
    allowInstallment: payload.allow_installment,
    allowedTerms: payload.allowed_terms?.map(
      mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
    ),
  };
}

export function mapXenditToGenericInvoicechannelPropertiesDto(
  payload: XenditInvoiceCardChannelPropertiesDto,
): InvoiceCardChannelPropertiesDto {
  if (!payload) {
    return;
  }

  return {
    installmentConfiguration: payload.installment_configuration?.map(
      mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationDto,
    ),
    allowedBins: payload.allowed_bins,
  };
}

export function mapXenditToGenericCreateInvoiceFeeRequestDto(
  payload: XenditInvoiceFeeDto,
): InvoiceFeeDto {
  return {
    type: payload.type,
    value: payload.value,
  };
}
