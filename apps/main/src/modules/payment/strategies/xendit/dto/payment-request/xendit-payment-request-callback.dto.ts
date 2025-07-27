import {
  PaymentAvailableCallbackAuthenticationFlow,
  PaymentAvailableCallbackEvent,
  PaymentAvailableCallbackVerificationResult,
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableRequestStatus,
  PaymentAvailableType,
} from '@apps/main/modules/payment/enum';
import { IsOptional } from 'class-validator';

export interface IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto {
  eci?: string;
  message_version?: string;
  authentication_value?: string;
  ds_trans_id?: string;
}

export interface IXenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto {
  authorization_code?: string;
  cvn_verification_result?: PaymentAvailableCallbackVerificationResult;
  address_verification_result?: PaymentAvailableCallbackVerificationResult;
  retrieval_reference_number?: string;
  network_response_code?: string;
  network_response_code_descriptor?: string;
  network_transaction_id?: string;
  acquirer_merchant_id?: string;
  reconciliation_id?: string;
}

export interface IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto {
  flow?: PaymentAvailableCallbackAuthenticationFlow;
  a_res?: IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto;
}

export interface IXenditPaymentRequestCallbackPaymentDetailDto {
  authorization_data?: IXenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto;
  authentication_data?: IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto;
  issuer_name?: string;
  sender_account_number?: string;
  sender_name?: number;
  receipt_id?: number;
  remark?: number;
  network?: number;
  fund_source?: number;
}

export interface IXenditPaymentRequestCallbackCaptureDto {
  capture_timestamp?: string;
  capture_id?: string;
  capture_amount?: number;
}

export interface IXenditPaymentRequestCallbackDataDto {
  payment_id?: string;
  business_id?: string;
  reference_id?: string;
  payment_request_id?: string;
  payment_token_id?: string;
  customer_id?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requested_amount?: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_code?: string;
  captures?: IXenditPaymentRequestCallbackCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  payment_details?: IXenditPaymentRequestCallbackPaymentDetailDto;
  failure_code?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export interface IXenditPaymentRequestCallbackDto {
  event?: PaymentAvailableCallbackEvent;
  business_id?: string;
  created?: string;
  data?: IXenditPaymentRequestCallbackDataDto;
}

export class XenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto
  implements IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto
{
  eci?: string;
  message_version?: string;
  authentication_value?: string;
  ds_trans_id?: string;
}

export class XenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto
  implements IXenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto
{
  authorization_code?: string;
  cvn_verification_result?: PaymentAvailableCallbackVerificationResult;
  address_verification_result?: PaymentAvailableCallbackVerificationResult;
  retrieval_reference_number?: string;
  network_response_code?: string;
  network_response_code_descriptor?: string;
  network_transaction_id?: string;
  acquirer_merchant_id?: string;
  reconciliation_id?: string;
}

export class XenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto
  implements IXenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto
{
  flow?: PaymentAvailableCallbackAuthenticationFlow;
  a_res?: XenditPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto;
}

export class XenditPaymentRequestCallbackPaymentDetailDto
  implements IXenditPaymentRequestCallbackPaymentDetailDto
{
  authorization_data?: XenditPaymentRequestCallbackPaymentDetailAuthorizationDataDto;
  authentication_data?: XenditPaymentRequestCallbackPaymentDetailAuthenticationDataDto;
  issuer_name?: string;
  sender_account_number?: string;
  sender_name?: number;
  receipt_id?: number;
  remark?: number;
  network?: number;
  fund_source?: number;
}

export class XenditPaymentRequestCallbackCaptureDto
  implements IXenditPaymentRequestCallbackCaptureDto
{
  capture_timestamp?: string;
  capture_id?: string;
  capture_amount?: number;
}

export class XenditPaymentRequestCallbackDataDto
  implements IXenditPaymentRequestCallbackDataDto
{
  payment_id?: string;
  business_id?: string;
  reference_id?: string;
  payment_request_id?: string;
  payment_token_id?: string;
  customer_id?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  request_amount?: number;
  capture_method?: PaymentAvailableCaptureMethod;
  channel_code?: string;
  captures?: XenditPaymentRequestCallbackCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  payment_details?: XenditPaymentRequestCallbackPaymentDetailDto;
  failure_code?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export class XenditPaymentRequestCallbackDto
  implements IXenditPaymentRequestCallbackDto
{
  @IsOptional()
  event?: PaymentAvailableCallbackEvent;

  @IsOptional()
  business_id?: string;

  @IsOptional()
  created?: string;

  @IsOptional()
  data?: XenditPaymentRequestCallbackDataDto;

  @IsOptional()
  api_version?: string;
}
