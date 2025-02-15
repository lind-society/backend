import { PaymentCustomerAddress } from './payment-customer-address.dto';

export class PaymentCustomerDto {
  id: string;
  phoneNumber: string;
  givenNames: string;
  surname: string;
  email: string;
  mobileNumber: string;
  customerId: string;
  addresses: PaymentCustomerAddress[];
}
