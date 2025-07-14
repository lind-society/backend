import { AvailableLanguage, AvailableReminderTimeUnit } from '../../enum';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import { ICreatePaymentItemRequestDto } from '../item';
import {
  IInvoiceCardChannelPropertiesDto,
  IInvoiceCustomerNotificationPreferenceDto,
  IInvoiceFeeDto,
  InvoiceCardChannelPropertiesDto,
  InvoiceCustomerNotificationPreferenceDto,
  InvoiceFeeDto,
} from './invoice-related-field.dto';

export interface ICreateInvoiceRequestDto {
  externalId: string;
  amount: number;
  description?: string;
  customer?: IPaymentCustomerDto;
  customer_notification_preference?: IInvoiceCustomerNotificationPreferenceDto;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency: string;
  callbackVirtualAccountId?: string;
  mid_label?: string;
  reminder_time_unit?: AvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: AvailableLanguage;
  items?: ICreatePaymentItemRequestDto[];
  fees?: IInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: IInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}

export class CreateInvoiceRequestDto implements ICreateInvoiceRequestDto {
  externalId: string;
  amount: number;
  description?: string;
  customer?: PaymentCustomerDto;
  customer_notification_preference?: InvoiceCustomerNotificationPreferenceDto;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency: string;
  callbackVirtualAccountId?: string;
  mid_label?: string;
  reminder_time_unit?: AvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: AvailableLanguage;
  items?: ICreatePaymentItemRequestDto[];
  fees?: InvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: InvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}
