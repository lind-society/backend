import {
  InvoiceCardChannelPropertiesDto,
  InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
  InvoiceCardChannelPropertiesInstallmentConfigurationDto,
  InvoiceFeeDto,
  PaymentAvailableCustomerNotificationPreferenceDto,
} from '@apps/main/modules/payment/dto/invoice/shared-invoice-field.dto';
import {
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
  XenditInvoiceCardChannelPropertiesInstallmentConfigurationDto,
  XenditInvoiceFeeDto,
  XenditPaymentAvailableCustomerNotificationPreferenceDto,
} from '../../../dto/invoice';
import { mapXenditToGenericPaymentAvailableCustomerNotificationPreference } from '../../enum-mapper/xendit-invoice-customer-notification-preference-enum-mapper.helper';

export function mapXenditToGenericPaymentAvailableCustomerNotificationPreferenceDto(
  payload: XenditPaymentAvailableCustomerNotificationPreferenceDto,
): PaymentAvailableCustomerNotificationPreferenceDto {
  if (!payload) {
    return;
  }

  return {
    invoiceCreated: payload.invoice_created?.map(
      mapXenditToGenericPaymentAvailableCustomerNotificationPreference,
    ),
    invoicePaid: payload.invoice_paid?.map(
      mapXenditToGenericPaymentAvailableCustomerNotificationPreference,
    ),
    invoiceReminder: payload.invoice_reminder?.map(
      mapXenditToGenericPaymentAvailableCustomerNotificationPreference,
    ),
  };
}

export function mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto(
  payload: XenditInvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto,
): InvoiceCardChannelPropertiesInstallmentConfigurationAllowedTermDto {
  if (!payload) {
    return;
  }

  return {
    issuer: payload.issuer,
    terms: payload.terms,
  };
}

export function mapXenditToGenericInvoiceCardChannelPropertiesInstallmentConfigurationDto(
  payload: XenditInvoiceCardChannelPropertiesInstallmentConfigurationDto,
): InvoiceCardChannelPropertiesInstallmentConfigurationDto {
  if (!payload) {
    return;
  }

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
  payload: XenditInvoiceFeeDto[],
): InvoiceFeeDto[] {
  if (!payload || !payload.length) {
    return;
  }

  return payload.map((item) => ({
    type: item.type,
    value: item.value,
  }));
}
