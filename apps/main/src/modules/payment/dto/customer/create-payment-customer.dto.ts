import {
  IPaymentCustomerAddressDto,
  IPaymentCustomerBusinessDetailDto,
  IPaymentCustomerIndividualDetailDto,
  IPaymentCustomerKYCDocumentDto,
  PaymentCustomerAddressDto,
  PaymentCustomerBusinessDetailDto,
  PaymentCustomerIndividualDetailDto,
  PaymentCustomerKYCDocumentDto,
} from './shared-payment-customer-field.dto';

export interface ICreatePaymentCustomerDto {
  individualDetail?: IPaymentCustomerIndividualDetailDto;
  businessDetail?: IPaymentCustomerBusinessDetailDto;
  mobileNumber?: string;
  phoneNumber?: string;
  email?: string;
  addresses?: IPaymentCustomerAddressDto[];
  kycDocuments?: IPaymentCustomerKYCDocumentDto[];
  description?: string;
  dateOfRegistration?: string;
  domicileOfRegistration?: string;
  metadata?: Record<string, any>;
}

export class CreatePaymentCustomerDto implements ICreatePaymentCustomerDto {
  individualDetail?: PaymentCustomerIndividualDetailDto;
  businessDetail?: PaymentCustomerBusinessDetailDto;
  mobileNumber?: string;
  phoneNumber?: string;
  email?: string;
  addresses?: PaymentCustomerAddressDto[];
  kycDocuments?: PaymentCustomerKYCDocumentDto[];
  description?: string;
  dateOfRegistration?: string;
  domicileOfRegistration?: string;
  metadata?: Record<string, any>;
}
