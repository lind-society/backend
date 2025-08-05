import { ShippingInformationDto } from '@apps/main/modules/payment/dto';
import { XenditShippingInformationDto } from '../../../dto/payment-request';

export function mapGenericToXenditShippingConfiguration(
  payload: ShippingInformationDto,
): XenditShippingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postal_code: payload.postalCode,
    street_line1: payload.streetLine1,
    street_line2: payload.streetLine2,
    province_state: payload.provinceState,
  };
}

export function mapXenditToGenericShippingConfiguration(
  payload: XenditShippingInformationDto,
): ShippingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postalCode: payload.postal_code,
    streetLine1: payload.street_line1,
    streetLine2: payload.street_line2,
    provinceState: payload.province_state,
  };
}
