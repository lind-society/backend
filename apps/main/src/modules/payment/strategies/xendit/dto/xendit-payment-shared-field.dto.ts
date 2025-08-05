import {
  PaymentAvailableAuthenticationFlow,
  PaymentAvailableCardOnFileType,
  PaymentAvailableDeviceType,
  PaymentAvailableInstallmentConfigurationTerm,
  PaymentAvailableRedeemPoint,
  PaymentAvailableVerificationResult,
} from '../../../enum';

export interface IXenditRecurringConfigurationDto {
  recurring_expiry: string;
  recurring_frequency: number;
}

export interface IXenditPaymentCaptureDto {
  capture_timestamp?: string;
  capture_id?: string;
  capture_amount?: number;
}

export interface IXenditPaymentDetailAuthenticationDataAResDto {
  eci?: string;
  message_version?: string;
  authentication_value?: string;
  ds_trans_id?: string;
}
export interface IXenditPaymentDetailAuthorizationDataDto {
  authorization_code?: string;
  cvn_verification_result?: PaymentAvailableVerificationResult;
  address_verification_result?: PaymentAvailableVerificationResult;
  retrieval_reference_number?: string;
  network_response_code?: string;
  network_response_code_descriptor?: string;
  network_transaction_id?: string;
  acquirer_merchant_id?: string;
  reconciliation_id?: string;
}
export interface IXenditPaymentDetailAuthenticationDataDto {
  flow?: PaymentAvailableAuthenticationFlow;
  a_res?: IXenditPaymentDetailAuthenticationDataAResDto;
}
export interface IXenditPaymentDetailDto {
  authorization_data?: IXenditPaymentDetailAuthorizationDataDto;
  authentication_data?: IXenditPaymentDetailAuthenticationDataDto;
  issuer_name?: string;
  sender_account_number?: string;
  sender_name?: number;
  receipt_id?: number;
  remark?: number;
  network?: number;
  fund_source?: number;
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

export interface IXenditCardDetailsDto {
  cvn?: string;
  card_number?: string;
  expiry_year?: string;
  expiry_month?: string;
  cardholder_first_name?: string;
  cardholder_last_name?: string;
  cardholder_email?: string;
  cardholder_phone_number?: string;
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
  skip_three_ds?: boolean;
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

export class XenditRecurringConfigurationDto
  implements IXenditRecurringConfigurationDto
{
  recurring_expiry: string;
  recurring_frequency: number;
}

export class XenditPaymentCaptureDto implements IXenditPaymentCaptureDto {
  capture_timestamp?: string;
  capture_id?: string;
  capture_amount?: number;
}
export class XenditPaymentDetailAuthenticationDataAResDto
  implements IXenditPaymentDetailAuthenticationDataAResDto
{
  eci?: string;
  message_version?: string;
  authentication_value?: string;
  ds_trans_id?: string;
}
export class XenditPaymentDetailAuthorizationDataDto
  implements IXenditPaymentDetailAuthorizationDataDto
{
  authorization_code?: string;
  cvn_verification_result?: PaymentAvailableVerificationResult;
  address_verification_result?: PaymentAvailableVerificationResult;
  retrieval_reference_number?: string;
  network_response_code?: string;
  network_response_code_descriptor?: string;
  network_transaction_id?: string;
  acquirer_merchant_id?: string;
  reconciliation_id?: string;
}
export class XenditPaymentDetailAuthenticationDataDto
  implements IXenditPaymentDetailAuthenticationDataDto
{
  flow?: PaymentAvailableAuthenticationFlow;
  a_res?: XenditPaymentDetailAuthenticationDataAResDto;
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
export class XenditPaymentDetailDto implements IXenditPaymentDetailDto {
  authorization_data?: XenditPaymentDetailAuthorizationDataDto;
  authentication_data?: XenditPaymentDetailAuthenticationDataDto;
  issuer_name?: string;
  sender_account_number?: string;
  sender_name?: number;
  receipt_id?: number;
  remark?: number;
  network?: number;
  fund_source?: number;
}

export class XenditCardDetailsDto implements IXenditCardDetailsDto {
  cvn?: string;
  card_number?: string;
  expiry_year?: string;
  expiry_month?: string;
  cardholder_first_name?: string;
  cardholder_last_name?: string;
  cardholder_email?: string;
  cardholder_phone_number?: string;
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
  skip_three_ds?: boolean;
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
