import { PaymentCustomerDto } from '@apps/main/modules/payment/dto/customer/payment-customer.dto';
import { XenditCustomerDto } from '../../../dto/customer/xendit-customer.dto';

export function mapGenericToXenditCustomerDto(
  payload: PaymentCustomerDto,
): XenditCustomerDto {
  return {
    reference_id: `${payload.referenceId}_${Date.now()}`,
    type: payload.type,
    email: payload.email,
    mobile_number: payload.mobileNumber,
    individual_detail: {
      given_names: payload.givenName,
      surname: payload.surname,
    },
  };
}
