import { CreatePaymentCustomerDto } from '@apps/main/modules/payment/dto';
import { XenditCreateCustomerRequestDto } from '../../../dto';

export function mapXenditToGenericCustomerDto(
  payload: XenditCreateCustomerRequestDto,
): CreatePaymentCustomerDto {
  return {
    type: payload.type,
    email: payload.email,
    mobileNumber: payload.mobile_number,
    givenName: payload.given_names,
    surname: payload.surname,
    address: payload.addresses?.[0]?.[0],
  };
}
