import {
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
  PaymentAvailableFailureCode,
  PaymentAvailableTokenStatus,
} from '../../enum';
import { IPaymentActionDto } from '../payment-request';
import {
  IChannelPropertiesDto,
  IPaymentDetailAuthenticationDataDto,
  IPaymentDetailAuthorizationDataDto,
  PaymentDetailAuthenticationDataDto,
  PaymentDetailAuthorizationDataDto,
} from '../payment-shared-field.dto';

export interface IPaymentTokenDetails {
  authorizationData: IPaymentDetailAuthorizationDataDto;
  authenticationData: IPaymentDetailAuthenticationDataDto;
  accountName: string;
  accountBalance: string;
  accountPointBalance: string;
  accountNumber: string;
}

export interface IPaymentTokenDto {
  paymentTokenId: string;
  channelCode: string;
  country: PaymentAvailableCountry;
  businessId: string;
  customerId: string;
  referenceId: string;
  currency: PaymentAvailableCurrency;
  channelProperties: IChannelPropertiesDto;
  actions: IPaymentActionDto[];
  status: PaymentAvailableTokenStatus;
  tokenDetails: IPaymentTokenDetails;
  failureCode: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  description: string;
  created: string;
  updated: string;
}

export class PaymentTokenDetails implements IPaymentTokenDetails {
  authorizationData: PaymentDetailAuthorizationDataDto;
  authenticationData: PaymentDetailAuthenticationDataDto;
  accountName: string;
  accountBalance: string;
  accountPointBalance: string;
  accountNumber: string;
}

export class PaymentTokenDto implements IPaymentTokenDto {
  paymentTokenId: string;
  channelCode: string;
  country: PaymentAvailableCountry;
  businessId: string;
  customerId: string;
  referenceId: string;
  currency: PaymentAvailableCurrency;
  channelProperties: IChannelPropertiesDto;
  actions: IPaymentActionDto[];
  status: PaymentAvailableTokenStatus;
  tokenDetails: IPaymentTokenDetails;
  failureCode: PaymentAvailableFailureCode;
  metadata: Record<string, any>;
  description: string;
  created: string;
  updated: string;
}
