import { PaymentCustomerDto } from '../../payment/dto';
import { PaymentAvailableCustomerType } from '../../payment/enum';

export function constructPaymentCustomer(
  customerId: string,
  customerName: string,
): PaymentCustomerDto {
  const splittedName = customerName.trim().split(/\s+/);

  return {
    referenceId: `${customerId}_${new Date()}`,
    type: PaymentAvailableCustomerType.Individual,
    individualDetail: {
      givenNames: splittedName[0],
      surname: splittedName.slice(1).join(' '),
    },
  };
}
