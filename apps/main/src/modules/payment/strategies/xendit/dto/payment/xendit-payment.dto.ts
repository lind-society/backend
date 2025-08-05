import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentStatus,
  PaymentAvailableType,
} from '@apps/main/modules/payment/enum';
import {
  IXenditPaymentDetailDto,
  XenditPaymentCaptureDto,
  XenditPaymentDetailDto,
} from '../xendit-payment-shared-field.dto';

export interface IXenditPaymentDto {
  payment_id: string;
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  payment_token_id: string;
  customer_id: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  request_amount: number;
  capture_method: PaymentAvailableCaptureMethod;
  channel_code: string;
  captures: XenditPaymentCaptureDto[];
  status: PaymentAvailablePaymentStatus;
  payment_details: IXenditPaymentDetailDto;
  failure_code: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export class XenditPaymentDto implements IXenditPaymentDto {
  payment_id: string;
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  payment_token_id: string;
  customer_id: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  request_amount: number;
  capture_method: PaymentAvailableCaptureMethod;
  channel_code: string;
  captures: XenditPaymentCaptureDto[];
  status: PaymentAvailablePaymentStatus;
  payment_details: XenditPaymentDetailDto;
  failure_code: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}
