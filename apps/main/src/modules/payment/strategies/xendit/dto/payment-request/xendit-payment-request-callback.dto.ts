import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableRequestStatus,
  PaymentAvailableType,
} from '@apps/main/modules/payment/enum';
import { IsOptional } from 'class-validator';
import {
  IXenditPaymentBaseCallbackDto,
  XenditPaymentBaseCallbackDto,
} from '../xendit-payment-base-webhook.dto';
import {
  IXenditPaymentCaptureDto,
  IXenditPaymentDetailDto,
  XenditPaymentCaptureDto,
  XenditPaymentDetailDto,
} from '../xendit-payment-shared-field.dto';

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
  captures?: IXenditPaymentCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  payment_details?: IXenditPaymentDetailDto;
  failure_code?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export interface IXenditPaymentRequestCallbackDto
  extends IXenditPaymentBaseCallbackDto<IXenditPaymentRequestCallbackDataDto> {
  data: IXenditPaymentRequestCallbackDataDto;
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
  captures?: XenditPaymentCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  payment_details?: XenditPaymentDetailDto;
  failure_code?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export class XenditPaymentRequestCallbackDto
  extends XenditPaymentBaseCallbackDto<XenditPaymentRequestCallbackDataDto>
  implements IXenditPaymentRequestCallbackDto
{
  @IsOptional()
  data: XenditPaymentRequestCallbackDataDto;
}
