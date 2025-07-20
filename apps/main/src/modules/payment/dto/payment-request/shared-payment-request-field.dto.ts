import {
  PaymentAvailableCardOnFileType,
  PaymentAvailableCountry,
  PaymentAvailableDeviceType,
  PaymentAvailableInstallmentConfigurationTerm,
  PaymentAvailableRedeemPoint,
} from '../../enum';
import {
  IRecurringConfigurationDto,
  RecurringConfigurationDto,
} from '../payment-shared-field.dto';

export interface ICardDetailsDto {
  cvn?: string;
  cardNumber?: string;
  expiryYear?: string;
  expiryMonth?: string;
  cardHolderName?: string;
  cardHolderEmail?: string;
  cardHolderPhoneNumber?: string;
}

export interface IInstallmentConfigurationDto {
  terms?: PaymentAvailableInstallmentConfigurationTerm;
  interval?: number[];
}

export interface IBillingInformationDto {
  city?: string;
  country?: string;
  postalCode?: string;
  streetLine1?: string;
  streetLine2?: string;
  provinceState?: string;
}

export interface IChannelPropertiesDto {
  successReturnUrl?: string;
  failureReturnUrl?: string;
  cancelReturnUrl?: string;
  pendingReturnUrl?: string;
  expiresAt?: string;
  payerName?: string;
  displayName?: string;
  paymentCode?: string;
  virtualAccountNumber?: string;
  suggestedAmount?: string;
  cashtag?: string;
  cardDetails?: ICardDetailsDto;
  midLabel?: string;
  skipThreeDs?: string;
  cardOnFileType?: PaymentAvailableCardOnFileType;
  billingInformation?: IBillingInformationDto;
  statementDescriptor?: string;
  recurringConfiguration?: IRecurringConfigurationDto;
  accountEmail?: string;
  accountMobileNumber?: string;
  cardLastFour?: string;
  cardExpiry?: string;
  accountIdentityNumber?: string;
  payerEmail?: string;
  deviceType?: PaymentAvailableDeviceType;
  description?: string;
  enableOtp?: boolean;
  allowedPaymentOptions?: string[]; // footnote (1)
  redeemPoints?: PaymentAvailableRedeemPoint;
  payerIpAddress?: string;
  installmentConfiguration?: IInstallmentConfigurationDto;
}

export interface IShippingInformationDto {
  country: PaymentAvailableCountry;
  streetLine1: string;
  streetLine2: string;
  city: string;
  provinceState: string;
  postalCode: string;
}

export class CardDetailsDto implements ICardDetailsDto {
  cvn?: string;
  cardNumber?: string;
  expiryYear?: string;
  expiryMonth?: string;
  cardHolderName?: string;
  cardHolderEmail?: string;
  cardHolderPhoneNumber?: string;
}

export class InstallmentConfigurationDto
  implements IInstallmentConfigurationDto
{
  terms?: PaymentAvailableInstallmentConfigurationTerm;
  interval?: number[];
}

export class BillingInformationDto implements IBillingInformationDto {
  city?: string;
  country?: string;
  postalCode?: string;
  streetLine1?: string;
  streetLine2?: string;
  provinceState?: string;
}

export class ChannelPropertiesDto implements IChannelPropertiesDto {
  successReturnUrl?: string;
  failureReturnUrl?: string;
  cancelReturnUrl?: string;
  pendingReturnUrl?: string;
  expiresAt?: string;
  payerName?: string;
  displayName?: string;
  paymentCode?: string;
  virtualAccountNumber?: string;
  suggestedAmount?: string;
  cashtag?: string;
  cardDetails?: CardDetailsDto;
  midLabel?: string;
  skipThreeDs?: string;
  cardOnFileType?: PaymentAvailableCardOnFileType;
  billingInformation?: BillingInformationDto;
  statementDescriptor?: string;
  recurringConfiguration?: RecurringConfigurationDto;
  accountEmail?: string;
  accountMobileNumber?: string;
  cardLastFour?: string;
  cardExpiry?: string;
  accountIdentityNumber?: string;
  payerEmail?: string;
  deviceType?: PaymentAvailableDeviceType;
  description?: string;
  enableOtp?: boolean;
  allowedPaymentOptions?: string[]; // footnote (1)
  redeemPoints?: PaymentAvailableRedeemPoint;
  payerIpAddress?: string;
  installmentConfiguration?: InstallmentConfigurationDto;
}

export class ShippingInformationDto implements IShippingInformationDto {
  country: PaymentAvailableCountry;
  streetLine1: string;
  streetLine2: string;
  city: string;
  provinceState: string;
  postalCode: string;
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
