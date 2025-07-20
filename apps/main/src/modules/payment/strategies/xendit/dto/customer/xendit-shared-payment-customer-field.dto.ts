import {
  PaymentAvailableAddressCategory,
  PaymentAvailableBusinessType,
  PaymentAvailableCustomerKYCDocumentSubType,
  PaymentAvailableCustomerKYCDocumentType,
  PaymentAvailableGender,
} from '@apps/main/modules/payment/enum';

export interface IXenditPaymentCustomerIndividualDetailEmploymentDto {
  employer_name?: string;
  nature_of_business?: string;
  role_description?: string;
}

export interface IXenditPaymentCustomerIndividualDetailDto {
  given_names: string;
  surname?: string;
  nationality?: string;
  place_of_birth?: string;
  date_of_birth?: string; // YYYY-MM-DD
  gender?: PaymentAvailableGender;
  employment?: IXenditPaymentCustomerIndividualDetailEmploymentDto;
}

export interface IXenditPaymentCustomerBusinessDetailDto {
  business_name: string;
  trading_name?: string;
  business_type?: PaymentAvailableBusinessType;
  nature_of_business?: string;
  business_domicile?: string;
  date_of_registration?: string;
}

export interface IXenditPaymentCustomerAddressDto {
  country: string;
  street_line1?: string;
  street_line2?: string;
  city?: string;
  province_state?: string;
  postal_code?: string;
  category?: PaymentAvailableAddressCategory;
  is_primary?: boolean;
}

export interface IXenditPaymentCustomerKYCDocumentDto {
  country?: string;
  type?: PaymentAvailableCustomerKYCDocumentType;
  sub_type?: PaymentAvailableCustomerKYCDocumentSubType;
  document_name?: string;
  document_number?: string;
  expires_at?: string;
  holder_name?: string;
  document_images?: string[];
}

export class XenditPaymentCustomerIndividualDetailEmploymentDto
  implements IXenditPaymentCustomerIndividualDetailEmploymentDto
{
  employer_name?: string;
  nature_of_business?: string;
  role_description?: string;
}

export class XenditPaymentCustomerIndividualDetailDto
  implements IXenditPaymentCustomerIndividualDetailDto
{
  given_names: string;
  surname?: string;
  nationality?: string;
  place_of_birth?: string;
  date_of_birth?: string; // YYYY-MM-DD
  gender?: PaymentAvailableGender;
  employment?: IXenditPaymentCustomerIndividualDetailEmploymentDto;
}

export class XenditPaymentCustomerBusinessDetailDto
  implements IXenditPaymentCustomerBusinessDetailDto
{
  business_name: string;
  trading_name?: string;
  business_type?: PaymentAvailableBusinessType;
  nature_of_business?: string;
  business_domicile?: string;
  date_of_registration?: string;
}

export class XenditPaymentCustomerAddressDto
  implements IXenditPaymentCustomerAddressDto
{
  country: string;
  street_line1?: string;
  street_line2?: string;
  city?: string;
  province_state?: string;
  postal_code?: string;
  category?: PaymentAvailableAddressCategory;
  is_primary?: boolean;
}

export class XenditPaymentCustomerKYCDocumentDto
  implements IXenditPaymentCustomerKYCDocumentDto
{
  country?: string;
  type?: PaymentAvailableCustomerKYCDocumentType;
  sub_type?: PaymentAvailableCustomerKYCDocumentSubType;
  document_name?: string;
  document_number?: string;
  expires_at?: string;
  holder_name?: string;
  document_images?: string[];
}
