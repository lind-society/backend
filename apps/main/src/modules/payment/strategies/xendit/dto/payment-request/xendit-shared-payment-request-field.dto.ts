import { PaymentAvailableCountry } from '@apps/main/modules/payment/enum';

export interface IXenditShippingInformationDto {
  city: string;
  country: PaymentAvailableCountry;
  street_line1: string;
  street_line2: string;
  province_state: string;
  postal_code: string;
}

export class XenditShippingInformationDto
  implements IXenditShippingInformationDto
{
  city: string;
  country: PaymentAvailableCountry;
  street_line1: string;
  street_line2: string;
  province_state: string;
  postal_code: string;
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
