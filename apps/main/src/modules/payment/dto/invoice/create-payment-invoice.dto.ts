import {
  PaymentAvailableCurrency,
  PaymentAvailableLanguage,
  PaymentAvailableReminderTimeUnit,
} from '../../enum';
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
  customer_notification_preference?: IPaymentAvailableCustomerNotificationPreferenceDto;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency: PaymentAvailableCurrency;
  callbackVirtualAccountId?: string;
  mid_label?: string;
  reminder_time_unit?: PaymentAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: PaymentAvailableLanguage;
  items?: IPaymentItemDto[];
  fees?: IInvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: IInvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}

export class CreatePaymentInvoiceDto implements ICreatePaymentInvoiceDto {
  externalId: string;
  amount: number;
  description?: string;
  customer?: PaymentCustomerDto;
  customer_notification_preference?: PaymentAvailableCustomerNotificationPreferenceDto;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency: PaymentAvailableCurrency;
  callbackVirtualAccountId?: string;
  mid_label?: string;
  reminder_time_unit?: PaymentAvailableReminderTimeUnit;
  reminder_time?: number;
  locale?: PaymentAvailableLanguage;
  items?: PaymentItemDto[];
  fees?: InvoiceFeeDto[];
  should_authenticate_credit_card?: boolean;
  channel_properties?: InvoiceCardChannelPropertiesDto;
  metadata?: Record<string, any>;
}
