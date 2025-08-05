import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentAvailableCountry } from '../../enum';

export interface IShippingInformationDto {
  country?: PaymentAvailableCountry;
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  provinceState?: string;
  postalCode?: string;
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
