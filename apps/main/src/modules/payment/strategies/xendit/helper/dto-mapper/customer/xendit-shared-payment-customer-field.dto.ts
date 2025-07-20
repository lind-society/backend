import {
  PaymentCustomerAddressDto,
  PaymentCustomerBusinessDetailDto,
  PaymentCustomerIndividualDetailDto,
  PaymentCustomerIndividualDetailEmploymentDto,
  PaymentCustomerKYCDocumentDto,
} from '@apps/main/modules/payment/dto';
import {
  XenditPaymentCustomerAddressDto,
  XenditPaymentCustomerBusinessDetailDto,
  XenditPaymentCustomerIndividualDetailDto,
  XenditPaymentCustomerIndividualDetailEmploymentDto,
  XenditPaymentCustomerKYCDocumentDto,
} from '../../../dto';

export function mapGenericToXenditCustomerIndividualDetailEmploymentDto(
  payload: PaymentCustomerIndividualDetailEmploymentDto,
): XenditPaymentCustomerIndividualDetailEmploymentDto {
  if (!payload) {
    return;
  }

  return {
    employer_name: payload.employerName,
    nature_of_business: payload.natureOfBusiness,
    role_description: payload.roleDescription,
  };
}

export function mapGenericToXenditCustomerIndividualDetailDto(
  payload: PaymentCustomerIndividualDetailDto,
): XenditPaymentCustomerIndividualDetailDto {
  if (!payload) {
    return;
  }

  return {
    given_names: payload.givenNames,
    surname: payload.surname,
    nationality: payload.nationality,
    place_of_birth: payload.placeOfBirth,
    date_of_birth: payload.dateOfBirth, // YYYY-MM-DD
    gender: payload.gender,
    employment: mapGenericToXenditCustomerIndividualDetailEmploymentDto(
      payload.employment,
    ),
  };
}

export function mapGenericToXenditCustomerBusinessDetailDto(
  payload: PaymentCustomerBusinessDetailDto,
): XenditPaymentCustomerBusinessDetailDto {
  if (!payload) {
    return;
  }

  return {
    business_name: payload.businessName,
    trading_name: payload.tradingName,
    business_type: payload.businessType,
    nature_of_business: payload.natureOfBusiness,
    business_domicile: payload.businessDomicile,
    date_of_registration: payload.dateOfRegistration,
  };
}

export function mapGenericToXenditCustomerAddressesDto(
  payload: PaymentCustomerAddressDto[],
): XenditPaymentCustomerAddressDto[] {
  if (!payload) {
    return;
  }

  return payload.map((item) => ({
    country: item.category,
    street_line1: item.streetLine1,
    street_line2: item.streetLine2,
    city: item.city,
    province_state: item.provinceState,
    postal_code: item.postalCode,
    category: item.category,
    is_primary: item.isPrimary,
  }));
}

export function mapGenericToXenditCustomerKYCDocumentDto(
  payload: PaymentCustomerKYCDocumentDto[],
): XenditPaymentCustomerKYCDocumentDto[] {
  if (!payload) {
    return;
  }

  return payload.map((item) => ({
    country: item.country,
    type: item.type,
    sub_type: item.subType,
    document_name: item.documentName,
    document_number: item.documentNumber,
    expires_at: item.expiresAt,
    holder_name: item.holderName,
    document_images: item.documentImages,
  }));
}
