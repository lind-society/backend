export interface IPaymentCustomerDto {
  referenceId?: string;
  type?: string;
  email: string;
  mobileNumber: string;
  address?: string;
  givenName?: string;
  surname?: string;
}

export class PaymentCustomerDto implements IPaymentCustomerDto {
  referenceId?: string;
  type?: string;
  email: string;
  mobileNumber: string;
  address?: string;
  givenName?: string;
  surname?: string;
}
