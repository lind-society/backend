import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  city?: string;
  cvn?: string;
  cardNumber?: string;
  expiryYear?: string;
  expiryMonth?: string;
  cardHolderFirsName?: string;
  cardHolderLastName?: string;
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
  country?: PaymentAvailableCountry;
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  provinceState?: string;
  postalCode?: string;
}

export class CardDetailsDto implements ICardDetailsDto {
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsString()
  @IsNotEmpty()
  cvn?: string;

  @IsString()
  @IsNotEmpty()
  cardNumber?: string;

  @IsString()
  @IsNotEmpty()
  expiryYear?: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth?: string;

  @IsString()
  @IsNotEmpty()
  cardHolderFirstName?: string;

  @IsString()
  @IsNotEmpty()
  cardHolderLastName?: string;

  @IsString()
  @IsNotEmpty()
  cardHolderEmail?: string;

  @IsString()
  @IsNotEmpty()
  cardHolderPhoneNumber?: string;
}

export class InstallmentConfigurationDto
  implements IInstallmentConfigurationDto
{
  @IsEnum(PaymentAvailableInstallmentConfigurationTerm, {
    message: `payment request installment configuration must be one of: ${Object.values(PaymentAvailableInstallmentConfigurationTerm).join(', ')}`,
  })
  @IsOptional()
  terms?: PaymentAvailableInstallmentConfigurationTerm;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      each: true,
      message:
        'payment request installment configuration interval must be a valid number',
    },
  )
  interval?: number[];
}

export class BillingInformationDto implements IBillingInformationDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  streetLine1?: string;

  @IsString()
  @IsOptional()
  streetLine2?: string;

  @IsString()
  @IsOptional()
  provinceState?: string;
}

export class ChannelPropertiesDto implements IChannelPropertiesDto {
  @IsString()
  @IsOptional()
  successReturnUrl?: string;

  @IsString()
  @IsOptional()
  failureReturnUrl?: string;

  @IsString()
  @IsOptional()
  cancelReturnUrl?: string;

  @IsString()
  @IsOptional()
  pendingReturnUrl?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  payerName?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  paymentCode?: string;

  @IsString()
  @IsOptional()
  virtualAccountNumber?: string;

  @IsString()
  @IsOptional()
  suggestedAmount?: string;

  @IsString()
  @IsOptional()
  cashtag?: string;

  @ValidateNested({ each: true })
  @Type(() => CardDetailsDto)
  @IsOptional()
  cardDetails?: CardDetailsDto;

  @IsString()
  @IsOptional()
  midLabel?: string;

  @IsString()
  @IsOptional()
  skipThreeDs?: string;

  @IsEnum(PaymentAvailableCardOnFileType, {
    message: `payment request card on file type must be one of: ${Object.values(PaymentAvailableCardOnFileType).join(', ')}`,
  })
  @IsOptional()
  cardOnFileType?: PaymentAvailableCardOnFileType;

  @ValidateNested({ each: true })
  @Type(() => BillingInformationDto)
  @IsOptional()
  billingInformation?: BillingInformationDto;

  @IsString()
  @IsOptional()
  statementDescriptor?: string;

  @ValidateNested({ each: true })
  @Type(() => RecurringConfigurationDto)
  @IsOptional()
  recurringConfiguration?: RecurringConfigurationDto;

  @IsString()
  @IsOptional()
  accountEmail?: string;

  @IsString()
  @IsOptional()
  accountMobileNumber?: string;

  @IsString()
  @IsOptional()
  cardLastFour?: string;

  @IsString()
  @IsOptional()
  cardExpiry?: string;

  @IsString()
  @IsOptional()
  accountIdentityNumber?: string;

  @IsString()
  @IsOptional()
  payerEmail?: string;

  @IsEnum(PaymentAvailableDeviceType, {
    message: `payment request device type must be one of: ${Object.values(PaymentAvailableDeviceType).join(', ')}`,
  })
  @IsOptional()
  deviceType?: PaymentAvailableDeviceType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  enableOtp?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedPaymentOptions?: string[]; // footnote (1)

  @IsEnum(PaymentAvailableRedeemPoint, {
    message: `payment request redeem points must be one of: ${Object.values(PaymentAvailableRedeemPoint).join(', ')}`,
  })
  @IsOptional()
  redeemPoints?: PaymentAvailableRedeemPoint;

  @IsString()
  @IsOptional()
  payerIpAddress?: string;

  @ValidateNested({ each: true })
  @Type(() => InstallmentConfigurationDto)
  @IsOptional()
  installmentConfiguration?: InstallmentConfigurationDto;
}

export class ShippingInformationDto implements IShippingInformationDto {
  @IsEnum(PaymentAvailableCountry, {
    message: `shipping information country must be one of: ${Object.values(PaymentAvailableCountry).join(', ')}`,
  })
  @IsOptional()
  country?: PaymentAvailableCountry;

  @IsString()
  @IsOptional()
  streetLine1?: string;

  @IsString()
  @IsOptional()
  streetLine2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  provinceState?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;
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
