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
  IPaymentBaseCallbackDto,
  PaymentBaseCallbackDto,
} from '../payment-base-callback.dto';
import {
  IPaymentCaptureDto,
  IPaymentDetailDto,
  PaymentCaptureDto,
  PaymentDetailDto,
} from '../payment-shared-field.dto';

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
  captures?: IPaymentCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  paymentDetails?: IPaymentDetailDto;
  failureCode?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export interface IPaymentRequestCallbackDto
  extends IPaymentBaseCallbackDto<IPaymentRequestCallbackDataDto> {
  data: IPaymentRequestCallbackDataDto;
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
  captures?: PaymentCaptureDto[];
  status?: PaymentAvailableRequestStatus;
  paymentDetails?: PaymentDetailDto;
  failureCode?: PaymentAvailableFailureCode;
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
}

export class PaymentRequestCallbackDto
  extends PaymentBaseCallbackDto<PaymentRequestCallbackDataDto>
  implements IPaymentRequestCallbackDto
{
  @IsOptional()
  data: PaymentRequestCallbackDataDto;
}
