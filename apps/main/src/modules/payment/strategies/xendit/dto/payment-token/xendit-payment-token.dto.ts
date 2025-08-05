import {
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableTokenStatus,
} from '../../../../enum';
import { IXenditPaymentActionDto } from '../payment-request';
import {
  IXenditChannelPropertiesDto,
  IXenditPaymentDetailAuthenticationDataDto,
  IXenditPaymentDetailAuthorizationDataDto,
  XenditChannelPropertiesDto,
  XenditPaymentDetailAuthenticationDataDto,
  XenditPaymentDetailAuthorizationDataDto,
} from '../xendit-payment-shared-field.dto';

export interface IXenditPaymentTokenDetails {
  authorization_data: IXenditPaymentDetailAuthorizationDataDto;
  authentication_data: IXenditPaymentDetailAuthenticationDataDto;
  account_name: string;
  account_balance: string;
  account_point_balance: string;
  account_number: string;
}

export interface IXenditPaymentTokenDto {
  payment_token_id: string;
  channel_code: string;
  country: PaymentAvailableCountry;
  business_id: string;
  customer_id: string;
  reference_id: string;
  currency: PaymentAvailableCurrency;
  channel_properties: IXenditChannelPropertiesDto;
  actions: IXenditPaymentActionDto[];
  status: PaymentAvailableTokenStatus;
  token_details: IXenditPaymentTokenDetails;
  failure_code: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  description: string;
  created: string;
  updated: string;
}

export class XenditPaymentTokenDetails implements IXenditPaymentTokenDetails {
  authorization_data: XenditPaymentDetailAuthorizationDataDto;
  authentication_data: XenditPaymentDetailAuthenticationDataDto;
  account_name: string;
  account_balance: string;
  account_point_balance: string;
  account_number: string;
}

export class XenditPaymentTokenDto implements IXenditPaymentTokenDto {
  payment_token_id: string;
  channel_code: string;
  country: PaymentAvailableCountry;
  business_id: string;
  customer_id: string;
  reference_id: string;
  currency: PaymentAvailableCurrency;
  channel_properties: XenditChannelPropertiesDto;
  actions: IXenditPaymentActionDto[];
  status: PaymentAvailableTokenStatus;
  token_details: IXenditPaymentTokenDetails;
  failure_code: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  description: string;
  created: string;
  updated: string;
}
