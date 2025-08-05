import {
  PaymentAvailableCaptureMethod,
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailablePaymentStatus,
  PaymentAvailableType,
} from '@apps/main/modules/payment/enum';
import {
  IPaymentDetailDto,
  PaymentCaptureDto,
  PaymentDetailDto,
} from '../payment-shared-field.dto';

export interface IPaymentDto {
  paymentId: string;
  businessId: string;
  referenceId: string;
  paymentRequestId: string;
  paymentTokenId: string;
  customerId: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  requestAmount: number;
  captureMethod: PaymentAvailableCaptureMethod;
  channelCode: string;
  captures: PaymentCaptureDto[];
  status: PaymentAvailablePaymentStatus;
  paymentDetails: IPaymentDetailDto;
  failureCode: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export class PaymentDto implements IPaymentDto {
  paymentId: string;
  businessId: string;
  referenceId: string;
  paymentRequestId: string;
  paymentTokenId: string;
  customerId: string;
  type: PaymentAvailableType;
  country: PaymentAvailableCountry;
  currency: PaymentAvailableCurrency;
  requestAmount: number;
  captureMethod: PaymentAvailableCaptureMethod;
  channelCode: string;
  captures: PaymentCaptureDto[];
  status: PaymentAvailablePaymentStatus;
  paymentDetails: PaymentDetailDto;
  failureCode: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}
