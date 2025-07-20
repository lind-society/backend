import { XenditPaymentAvailableStatus } from '../../enum';
import {
  IXenditPaymentCustomerDto,
  XenditPaymentCustomerDto,
} from '../customer';
import { IXenditPaymentItemDto, XenditPaymentItemDto } from '../item';
import {
  IXenditBankDto,
  IXenditDirectDebitDto,
  IXenditEWalletDto,
  IXenditQRCodeDto,
  IXenditRetailOutletDto,
  XenditBankDto,
  XenditDirectDebitDto,
  XenditEWalletDto,
  XenditQRCodeDto,
  XenditRetailOutletDto,
} from '../payment-method';
import {
  IXenditInvoiceCardChannelPropertiesDto,
  IXenditInvoiceFeeDto,
  IXenditPaymentAvailableCustomerNotificationPreferenceDto,
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceFeeDto,
  XenditPaymentAvailableCustomerNotificationPreferenceDto,
} from './xendit-invoice-related-field-dto';

export interface IXenditPaymentInvoiceDto {
  id: string;
  external_id: string;
  user_id: string;
  status: XenditPaymentAvailableStatus;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  payer_email: string;
  description: string;
  expiry_date: string;
  invoice_url: string;
  customer: IXenditPaymentCustomerDto;
  customer_notification_preference: IXenditPaymentAvailableCustomerNotificationPreferenceDto;
  available_banks: IXenditBankDto[];
  available_retail_outlets: IXenditRetailOutletDto[];
  available_ewallets: IXenditEWalletDto[];
  available_qr_codes: IXenditQRCodeDto[];
  available_direct_debits: IXenditDirectDebitDto[];
  available_paylaters: any[];
  success_redirect_url: string;
  failure_redirect_url: string;
  reminder_date: string;
  fixed_va: boolean;
  mid_label: string;
  should_exclude_credit_card: boolean;
  should_send_email: boolean;
  created: string;
  updated: string;
  currency: string;
  items: IXenditPaymentItemDto[];
  fees: IXenditInvoiceFeeDto[];
  should_authenticate_credit_card: boolean;
  channel_properties: IXenditInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class XenditPaymentInvoiceDto implements IXenditPaymentInvoiceDto {
  id: string;
  external_id: string;
  user_id: string;
  status: XenditPaymentAvailableStatus;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  payer_email: string;
  description: string;
  expiry_date: string;
  invoice_url: string;
  customer: XenditPaymentCustomerDto;
  customer_notification_preference: XenditPaymentAvailableCustomerNotificationPreferenceDto;
  available_banks: XenditBankDto[];
  available_retail_outlets: XenditRetailOutletDto[];
  available_ewallets: XenditEWalletDto[];
  available_qr_codes: XenditQRCodeDto[];
  available_direct_debits: XenditDirectDebitDto[];
  available_paylaters: any[];
  success_redirect_url: string;
  failure_redirect_url: string;
  reminder_date: string;
  fixed_va: boolean;
  mid_label: string;
  should_exclude_credit_card: boolean;
  should_send_email: boolean;
  created: string;
  updated: string;
  currency: string;
  items: XenditPaymentItemDto[];
  fees: XenditInvoiceFeeDto[];
  should_authenticate_credit_card: boolean;
  channel_properties: XenditInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}
