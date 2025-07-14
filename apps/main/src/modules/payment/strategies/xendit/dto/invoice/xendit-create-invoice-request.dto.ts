import {
  XenditAvailableLanguage,
  XenditAvailableReminderTimeUnit,
} from '../../enum';
import {
  IXenditCreateCustomerRequestDto,
  XenditCreateCustomerRequestDto,
} from '../customer';
import {
  IXenditCreateItemRequestDto,
  XenditCreateItemRequestDto,
} from '../item';
import {
  IXenditInvoiceCardChannelPropertiesDto,
  IXenditInvoiceCustomerNotificationPreferenceDto,
  IXenditInvoiceFeeDto,
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceCustomerNotificationPreferenceDto,
  XenditInvoiceFeeDto,
} from './xendit-invoice-related-field-dto';

/**
 * Create Xendit Invoice Request Payload
 *
 * Notes :
 * property "fees" are prohibited in Indonesia, due of regulation
 * Reference: https://archive.developers.xendit.co/api-reference/#create-invoice
 */

export interface IXenditCreateInvoiceRequestDto {
  external_id: string;
  amount: number;
  description?: string;
  customer?: IXenditCreateCustomerRequestDto;
  customer_notification_preference?: IXenditInvoiceCustomerNotificationPreferenceDto;
  invoice_duration?: number;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  payment_methods?: string[];
  currency: string;
  callback_virtual_account_id?: string;
  mid_label?: string;
  reminder_time_unit?: XenditAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: XenditAvailableLanguage;
  items?: IXenditCreateItemRequestDto[];
  fees?: IXenditInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: IXenditInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}

export class XenditCreateInvoiceRequestDto
  implements IXenditCreateInvoiceRequestDto
{
  external_id: string;
  amount: number;
  description?: string;
  customer?: XenditCreateCustomerRequestDto;
  customer_notification_preference?: XenditInvoiceCustomerNotificationPreferenceDto;
  invoice_duration?: number;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  payment_methods?: string[];
  currency: string;
  callback_virtual_account_id?: string;
  mid_label?: string;
  reminder_time_unit?: XenditAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: XenditAvailableLanguage;
  items?: XenditCreateItemRequestDto[];
  fees?: XenditInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: XenditInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}
