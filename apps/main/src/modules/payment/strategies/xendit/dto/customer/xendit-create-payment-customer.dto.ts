import {
  IXenditPaymentCustomerAddressDto,
  IXenditPaymentCustomerBusinessDetailDto,
  IXenditPaymentCustomerIndividualDetailDto,
  IXenditPaymentCustomerKYCDocumentDto,
  XenditPaymentCustomerAddressDto,
  XenditPaymentCustomerBusinessDetailDto,
  XenditPaymentCustomerIndividualDetailDto,
  XenditPaymentCustomerKYCDocumentDto,
} from './xendit-shared-payment-customer-field.dto';

export interface IXenditCreatePaymentCustomerDto {
  individual_detail?: IXenditPaymentCustomerIndividualDetailDto;
  business_detail?: IXenditPaymentCustomerBusinessDetailDto;
  mobile_number?: string;
  phone_number?: string;
  email?: string;
  addresses?: IXenditPaymentCustomerAddressDto[];
  kyc_documents?: IXenditPaymentCustomerKYCDocumentDto[];
  description?: string;
  date_of_registration?: string;
  domicile_of_registration?: string;
  metadata?: Record<string, any>;
}

export class XenditCreatePaymentCustomerDto
  implements IXenditCreatePaymentCustomerDto
{
  individual_detail?: XenditPaymentCustomerIndividualDetailDto;
  business_detail?: XenditPaymentCustomerBusinessDetailDto;
  mobile_number?: string;
  phone_number?: string;
  email?: string;
  addresses?: XenditPaymentCustomerAddressDto[];
  kyc_documents?: XenditPaymentCustomerKYCDocumentDto[];
  description?: string;
  date_of_registration?: string;
  domicile_of_registration?: string;
  metadata?: Record<string, any>;
}
