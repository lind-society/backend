import { XenditPaymentStatus } from '../../enum';
import {
  IXenditCreateCustomerRequestDto,
  XenditCreateCustomerRequestDto,
} from '../customer';
import {
  IXenditCreateItemRequestDto,
  XenditCreateItemRequestDto,
} from '../item';
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
  IXenditInvoiceCustomerNotificationPreferenceDto,
  IXenditInvoiceFeeDto,
  XenditInvoiceCardChannelPropertiesDto,
  XenditInvoiceCustomerNotificationPreferenceDto,
  XenditInvoiceFeeDto,
} from './xendit-invoice-related-field-dto';

export interface IXenditCreateInvoiceResponseDto {
  id: string;
  external_id: string;
  user_id: string;
  status: XenditPaymentStatus;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  payer_email: string;
  description: string;
  expiry_date: string;
  invoice_url: string;
  customer: IXenditCreateCustomerRequestDto;
  customer_notification_preference: IXenditInvoiceCustomerNotificationPreferenceDto;
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
  items: IXenditCreateItemRequestDto[];
  fees: IXenditInvoiceFeeDto[];
  should_authenticate_credit_card: boolean;
  channel_properties: IXenditInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class XenditCreateInvoiceResponseDto
  implements IXenditCreateInvoiceResponseDto
{
  id: string;
  external_id: string;
  user_id: string;
  status: XenditPaymentStatus;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  payer_email: string;
  description: string;
  expiry_date: string;
  invoice_url: string;
  customer: XenditCreateCustomerRequestDto;
  customer_notification_preference: XenditInvoiceCustomerNotificationPreferenceDto;
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
  items: XenditCreateItemRequestDto[];
  fees: XenditInvoiceFeeDto[];
  should_authenticate_credit_card: boolean;
  channel_properties: XenditInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}
