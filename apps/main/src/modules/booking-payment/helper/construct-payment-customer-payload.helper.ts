import { BookingCustomerDto } from '../../booking/customer/dto';
import { PaymentCustomerDto } from '../../payment/dto';
import { PaymentAvailableCustomerType } from '../../payment/enum';

export function constructPaymentCustomer(
  bookingCustomer: BookingCustomerDto,
): PaymentCustomerDto {
  const splittedName = bookingCustomer.name.trim().split(/\s+/);

  return {
    referenceId: `${bookingCustomer.id}_${new Date()}`,
    type: PaymentAvailableCustomerType.Individual,
    individualDetail: {
      givenNames: splittedName[0],
      surname: splittedName.slice(1).join(' '),
    },
  };
}
