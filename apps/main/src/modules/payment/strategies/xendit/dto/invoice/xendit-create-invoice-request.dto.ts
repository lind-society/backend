import {
  XenditPaymentAvailableLanguage,
  XenditPaymentAvailableReminderTimeUnit,
} from '../../enum';
import {
  IXenditCreatePaymentCustomerDto,
  XenditCreatePaymentCustomerDto,
} from '../customer';
import { IXenditPaymentItemDto, XenditPaymentItemDto } from '../item';
import {
  IXenditInvoiceCardChannelPropertiesDto,
  IXenditInvoiceFeeDto,
  IXenditPaymentAvailableCustomerNotificationPreferenceDto,
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceFeeDto,
  XenditPaymentAvailableCustomerNotificationPreferenceDto,
} from './xendit-invoice-related-field-dto';

/**
 * Create Xendit Invoice Request Payload
 *
 * Notes :
 * property "fees" are prohibited in Indonesia, due of regulation
 * Reference: https://archive.developers.xendit.co/api-reference/#create-invoice
 */

export interface IXenditCreatePaymentInvoiceDto {
  external_id: string;
  amount: number;
  description?: string;
  customer?: IXenditCreatePaymentCustomerDto;
  customer_notification_preference?: IXenditPaymentAvailableCustomerNotificationPreferenceDto;
  invoice_duration?: number;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  payment_methods?: string[];
  currency: string;
  callback_virtual_account_id?: string;
  mid_label?: string;
  reminder_time_unit?: XenditPaymentAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: XenditPaymentAvailableLanguage;
  items?: IXenditPaymentItemDto[];
  fees?: IXenditInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: IXenditInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}

export class XenditCreatePaymentInvoiceDto
  implements IXenditCreatePaymentInvoiceDto
{
  external_id: string;
  amount: number;
  description?: string;
  customer?: XenditCreatePaymentCustomerDto;
  customer_notification_preference?: XenditPaymentAvailableCustomerNotificationPreferenceDto;
  invoice_duration?: number;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  payment_methods?: string[];
  currency: string;
  callback_virtual_account_id?: string;
  mid_label?: string;
  reminder_time_unit?: XenditPaymentAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: XenditPaymentAvailableLanguage;
  items?: XenditPaymentItemDto[];
  fees?: XenditInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: XenditInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}
