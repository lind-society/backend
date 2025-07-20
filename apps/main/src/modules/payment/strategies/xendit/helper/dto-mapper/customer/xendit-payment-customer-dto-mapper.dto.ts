import { PaymentCustomerDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentCustomerDto } from '../../../dto';
import {
  mapGenericToXenditCustomerAddressesDto,
  mapGenericToXenditCustomerBusinessDetailDto,
  mapGenericToXenditCustomerIndividualDetailDto,
  mapGenericToXenditCustomerKYCDocumentDto,
} from './xendit-shared-payment-customer-field.dto';

export function mapXenditToGenericPaymentCustomerDto(
  payload: XenditPaymentCustomerDto,
): PaymentCustomerDto {
  if (!payload) {
    return;
  }

  return {
    referenceId: `${payload.reference_id}_${Date.now()}`,
    type: payload.type,
    email: payload.email,
    mobileNumber: payload.mobile_number,
  };
}

export function mapGenericToXenditPaymentCustomerDto(
  payload: PaymentCustomerDto,
): XenditPaymentCustomerDto {
  if (!payload) {
    return;
  }

  return {
    reference_id: payload.referenceId,
    type: payload.type,
    individual_detail: mapGenericToXenditCustomerIndividualDetailDto(
      payload.individualDetail,
    ),
    business_detail: mapGenericToXenditCustomerBusinessDetailDto(
      payload.businessDetail,
    ),
    mobile_number: payload.mobileNumber,
    phone_number: payload.phoneNumber,
    email: payload.email,
    addresses: mapGenericToXenditCustomerAddressesDto(payload.addresses),
    kyc_documents: mapGenericToXenditCustomerKYCDocumentDto(
      payload.kycDocuments,
    ),
    description: payload.description,
    date_of_registration: payload.dateOfRegistration,
    domicile_of_registration: payload.domicileOfRegistration,
    metadata: payload.metadata,
  };
}
