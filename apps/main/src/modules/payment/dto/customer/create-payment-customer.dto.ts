export interface ICreatePaymentCustomerDto {
  referenceId?: string;
  type?: string;
  email: string;
  mobileNumber: string;
  address?: string;
  givenName?: string;
  surname?: string;
}

export class CreatePaymentCustomerDto implements ICreatePaymentCustomerDto {
  referenceId?: string;
  type?: string;
  email: string;
  mobileNumber: string;
  address?: string;
  givenName?: string;
  surname?: string;
}
