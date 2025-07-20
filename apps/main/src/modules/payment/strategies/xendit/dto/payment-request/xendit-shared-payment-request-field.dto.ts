import {
  PaymentAvailableCardOnFileType,
  PaymentAvailableCountry,
  PaymentAvailableDeviceType,
  PaymentAvailableInstallmentConfigurationTerm,
  PaymentAvailableRedeemPoint,
} from '@apps/main/modules/payment/enum';
import {
  IXenditRecurringConfigurationDto,
  XenditRecurringConfigurationDto,
} from '../xendit-payment-shared-field.dto';

export interface IXenditCardDetailsDto {
  cvn?: string;
  card_number?: string;
  expiry_year?: string;
  expiry_month?: string;
  card_holder_name?: string;
  card_holder_email?: string;
  card_holder_phone_number?: string;
}

export interface IXenditInstallmentConfigurationDto {
  terms?: PaymentAvailableInstallmentConfigurationTerm;
  interval?: number[];
}

export interface IXenditBillingInformationDto {
  city?: string;
  country?: string;
  postal_code?: string;
  street_line1?: string;
  street_line2?: string;
  province_state?: string;
}

export interface IXenditChannelPropertiesDto {
  success_return_url?: string;
  failure_return_url?: string;
  cancel_return_url?: string;
  pending_return_url?: string;
  expires_at?: string;
  payer_name?: string;
  display_name?: string;
  payment_code?: string;
  virtual_account_number?: string;
  suggested_amount?: string;
  cashtag?: string;
  card_details?: IXenditCardDetailsDto;
  mid_label?: string;
  skip_three_ds?: string;
  card_on_file_type?: PaymentAvailableCardOnFileType;
  billing_information?: IXenditBillingInformationDto;
  statement_descriptor?: string;
  recurring_configuration?: IXenditRecurringConfigurationDto;
  account_email?: string;
  account_mobile_number?: string;
  card_last_four?: string;
  card_expiry?: string;
  account_identity_number?: string;
  payer_email?: string;
  device_type?: PaymentAvailableDeviceType;
  description?: string;
  enable_otp?: boolean;
  allowed_payment_options?: string[]; // footnote (1)
  redeem_points?: PaymentAvailableRedeemPoint;
  payer_ip_address?: string;
  installment_configuration?: IXenditInstallmentConfigurationDto;
}

export interface IXenditShippingInformationDto {
  city: string;
  country: PaymentAvailableCountry;
  street_line1: string;
  street_line2: string;
  province_state: string;
  postal_code: string;
}

export class XenditCardDetailsDto implements IXenditCardDetailsDto {
  cvn?: string;
  card_number?: string;
  expiry_year?: string;
  expiry_month?: string;
  card_holder_name?: string;
  card_holder_email?: string;
  card_holder_phone_number?: string;
}

export class XenditInstallmentConfigurationDto
  implements IXenditInstallmentConfigurationDto
{
  terms?: PaymentAvailableInstallmentConfigurationTerm;
  interval?: number[];
}

export class XenditBillingInformationDto
  implements IXenditBillingInformationDto
{
  city?: string;
  country?: string;
  postal_code?: string;
  street_line1?: string;
  street_line2?: string;
  province_state?: string;
}

export class XenditChannelPropertiesDto implements IXenditChannelPropertiesDto {
  success_return_url?: string;
  failure_return_url?: string;
  cancel_return_url?: string;
  pending_return_url?: string;
  expires_at?: string;
  payer_name?: string;
  display_name?: string;
  payment_code?: string;
  virtual_account_number?: string;
  suggested_amount?: string;
  cashtag?: string;
  card_details?: XenditCardDetailsDto;
  mid_label?: string;
  skip_three_ds?: string;
  card_on_file_type?: PaymentAvailableCardOnFileType;
  billing_information?: XenditBillingInformationDto;
  statement_descriptor?: string;
  recurring_configuration?: XenditRecurringConfigurationDto;
  account_email?: string;
  account_mobile_number?: string;
  card_last_four?: string;
  card_expiry?: string;
  account_identity_number?: string;
  payer_email?: string;
  device_type?: PaymentAvailableDeviceType;
  description?: string;
  enable_otp?: boolean;
  allowed_payment_options?: string[]; // footnote (1)
  redeem_points?: PaymentAvailableRedeemPoint;
  payer_ip_address?: string;
  installment_configuration?: XenditInstallmentConfigurationDto;
}

export class XenditShippingInformationDto
  implements IXenditShippingInformationDto
{
  city: string;
  country: PaymentAvailableCountry;
  street_line1: string;
  street_line2: string;
  province_state: string;
  postal_code: string;
}

/**
 * Foot Notes
 * DTO Documentation References
 * - https://docs.xendit.co/docs/routing-payment-channels
 * 1. For available payment options, can be adjusted with these details :
 *    d on GRABPAY (MYR)
 *    PAYLATER_POSTPAID - Pay next month
 *    PAYLATER_INSTALLMENTS_4MO - Pay with installments
 *
 *    Currently implemented with type : array of string -> ICreateChannelPropertiesDto.allowedPaymentOptions?:string[]
 * */
