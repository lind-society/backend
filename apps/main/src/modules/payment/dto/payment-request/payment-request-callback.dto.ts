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

export interface IPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto {
  eci?: string;
  messageVersion?: string;
  authenticationValue?: string;
  dsTransId?: string;
}

export interface IPaymentRequestCallbackPaymentDetailAuthorizationDataDto {
  authorizationCode?: string;
  cvnVerificationResult?: PaymentAvailableCallbackVerificationResult;
  addressVerificationResult?: PaymentAvailableCallbackVerificationResult;
  retrievalReferenceNumber?: string;
  networkResponseCode?: string;
  networkResponseCodeDescriptor?: string;
  networkTransactionId?: string;
  acquirerMerchantId?: string;
  reconciliationId?: string;
}

export interface IPaymentRequestCallbackPaymentDetailAuthenticationDataDto {
  flow?: PaymentAvailableCallbackAuthenticationFlow;
  aRes?: IPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto;
}

export interface IPaymentRequestCallbackPaymentDetailDto {
  authorizationData?: IPaymentRequestCallbackPaymentDetailAuthorizationDataDto;
  authenticationData?: IPaymentRequestCallbackPaymentDetailAuthenticationDataDto;
  issuerName?: string;
  senderAccountNumber?: string;
  senderName?: number;
  receiptId?: number;
  remark?: number;
  network?: number;
  fundSource?: number;
}

export interface IPaymentRequestCallbackCaptureDto {
  captureTimestamp?: string;
  captureId?: string;
  captureAmount?: number;
}

export interface IPaymentRequestCallbackDataDto {
  paymentId?: string;
  businessId?: string;
  referenceId?: string;
  paymentRequestId?: string;
  paymentTokenId?: string;
  customerId?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requestedAmount?: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelCode?: string;
  captures?: IPaymentRequestCallbackCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  paymentDetails?: IPaymentRequestCallbackPaymentDetailDto;
  failureCode?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export interface IPaymentRequestCallbackDto {
  event?: PaymentAvailableCallbackEvent;
  businessId?: string;
  created?: string;
  data?: IPaymentRequestCallbackDataDto;
}

export class PaymentRequestCallbackPaymentDetailAuthenticationDataAResDto
  implements IPaymentRequestCallbackPaymentDetailAuthenticationDataAResDto
{
  eci?: string;
  messageVersion?: string;
  authenticationValue?: string;
  dsTransId?: string;
}

export class PaymentRequestCallbackPaymentDetailAuthorizationDataDto
  implements IPaymentRequestCallbackPaymentDetailAuthorizationDataDto
{
  authorizationCode?: string;
  cvnVerificationResult?: PaymentAvailableCallbackVerificationResult;
  addressVerificationResult?: PaymentAvailableCallbackVerificationResult;
  retrievalReferenceNumber?: string;
  networkResponseCode?: string;
  networkResponseCodeDescriptor?: string;
  networkTransactionId?: string;
  acquirerMerchantId?: string;
  reconciliationId?: string;
}

export class PaymentRequestCallbackPaymentDetailAuthenticationDataDto
  implements IPaymentRequestCallbackPaymentDetailAuthenticationDataDto
{
  flow?: PaymentAvailableCallbackAuthenticationFlow;
  aRes?: PaymentRequestCallbackPaymentDetailAuthenticationDataAResDto;
}

export class PaymentRequestCallbackPaymentDetailDto
  implements IPaymentRequestCallbackPaymentDetailDto
{
  authorizationData?: PaymentRequestCallbackPaymentDetailAuthorizationDataDto;
  authenticationData?: PaymentRequestCallbackPaymentDetailAuthenticationDataDto;
  issuerName?: string;
  senderAccountNumber?: string;
  senderName?: number;
  receiptId?: number;
  remark?: number;
  network?: number;
  fundSource?: number;
}

export class PaymentRequestCallbackCaptureDto
  implements IPaymentRequestCallbackCaptureDto
{
  captureTimestamp?: string;
  captureId?: string;
  captureAmount?: number;
}

export class PaymentRequestCallbackDataDto
  implements IPaymentRequestCallbackDataDto
{
  paymentId?: string;
  businessId?: string;
  referenceId?: string;
  paymentRequestId?: string;
  paymentTokenId?: string;
  customerId?: string;
  type?: PaymentAvailableType;
  country?: PaymentAvailableCountry;
  currency?: PaymentAvailableCurrency;
  requestAmount?: number;
  captureMethod?: PaymentAvailableCaptureMethod;
  channelCode?: string;
  captures?: PaymentRequestCallbackCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  paymentDetails?: PaymentRequestCallbackPaymentDetailDto;
  failureCode?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export class PaymentRequestCallbackDto implements IPaymentRequestCallbackDto {
  event?: PaymentAvailableCallbackEvent;
  businessId?: string;
  created?: string;
  data?: PaymentRequestCallbackDataDto;
  apiVersion?: string;
}
