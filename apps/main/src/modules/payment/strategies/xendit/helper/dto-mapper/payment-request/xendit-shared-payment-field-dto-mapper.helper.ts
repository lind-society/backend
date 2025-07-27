import {
  BillingInformationDto,
  CardDetailsDto,
  ChannelPropertiesDto,
  InstallmentConfigurationDto,
  RecurringConfigurationDto,
  ShippingInformationDto,
} from '@apps/main/modules/payment/dto';
import { XenditRecurringConfigurationDto } from '../../../dto';
import {
  XenditBillingInformationDto,
  XenditCardDetailsDto,
  XenditChannelPropertiesDto,
  XenditInstallmentConfigurationDto,
  XenditShippingInformationDto,
} from '../../../dto/payment-request';

// Generic to Xendit
export function mapGenericToXenditCardDetailsDto(
  payload: CardDetailsDto,
): XenditCardDetailsDto {
  if (!payload) {
    return;
  }

  return {
    cvn: payload.cvn,
    card_number: payload.cardNumber,
    expiry_year: payload.expiryYear,
    expiry_month: payload.expiryMonth,
    cardholder_first_name: payload.cardHolderFirstName,
    cardholder_last_name: payload.cardHolderLastName,
    cardholder_email: payload.cardHolderEmail,
    cardholder_phone_number: payload.cardHolderPhoneNumber,
  };
}

export function mapGenericToXenditBillingInformationDto(
  payload: BillingInformationDto,
): XenditBillingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postal_code: payload.postalCode,
    street_line1: payload.streetLine1,
    street_line2: payload.streetLine2,
    province_state: payload.provinceState,
  };
}

export function mapGenericToXenditRecurringConfiguration(
  payload: RecurringConfigurationDto,
): XenditRecurringConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    recurring_expiry: payload.recurringExpiry,
    recurring_frequency: payload.recurringFrequency,
  };
}

export function mapGenericToXenditInstallmentConfiguration(
  payload: InstallmentConfigurationDto,
): XenditInstallmentConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    terms: payload.terms,
    interval: payload.interval,
  };
}

export function mapGenericToXenditShippingConfiguration(
  payload: ShippingInformationDto,
): XenditShippingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postal_code: payload.postalCode,
    street_line1: payload.streetLine1,
    street_line2: payload.streetLine2,
    province_state: payload.provinceState,
  };
}

export function mapGenericToXenditChannelPropertiesDto(
  payload: ChannelPropertiesDto,
): XenditChannelPropertiesDto {
  if (!payload) {
    return;
  }

  return {
    success_return_url: payload.successReturnUrl,
    failure_return_url: payload.failureReturnUrl,
    cancel_return_url: payload.cancelReturnUrl,
    pending_return_url: payload.pendingReturnUrl,
    expires_at: payload.expiresAt,
    payer_name: payload.payerName,
    display_name: payload.displayName,
    payment_code: payload.paymentCode,
    virtual_account_number: payload.virtualAccountNumber,
    suggested_amount: payload.suggestedAmount,
    cashtag: payload.cashtag,
    card_details: mapGenericToXenditCardDetailsDto(payload.cardDetails),
    mid_label: payload.midLabel,
    skip_three_ds: payload.skipThreeDs,
    card_on_file_type: payload.cardOnFileType,
    billing_information: mapGenericToXenditBillingInformationDto(
      payload.billingInformation,
    ),
    statement_descriptor: payload.statementDescriptor,
    recurring_configuration: mapGenericToXenditRecurringConfiguration(
      payload.recurringConfiguration,
    ),
    account_email: payload.accountEmail,
    account_mobile_number: payload.accountMobileNumber,
    card_last_four: payload.cardLastFour,
    card_expiry: payload.cardExpiry,
    account_identity_number: payload.accountIdentityNumber,
    payer_email: payload.payerEmail,
    device_type: payload.deviceType,
    description: payload.description,
    enable_otp: payload.enableOtp,
    allowed_payment_options: payload.allowedPaymentOptions,
    redeem_points: payload.redeemPoints,
    payer_ip_address: payload.payerIpAddress,
    installment_configuration: mapGenericToXenditInstallmentConfiguration(
      payload.installmentConfiguration,
    ),
  };
}

// Xendit to Generic
export function mapXenditToGenericCardDetailsDto(
  payload: XenditCardDetailsDto,
): CardDetailsDto {
  if (!payload) {
    return;
  }

  return {
    cvn: payload.cvn,
    cardNumber: payload.card_number,
    expiryYear: payload.expiry_year,
    expiryMonth: payload.expiry_month,
    cardHolderFirstName: payload.cardholder_first_name,
    cardHolderLastName: payload.cardholder_last_name,
    cardHolderEmail: payload.cardholder_email,
    cardHolderPhoneNumber: payload.cardholder_phone_number,
  };
}

export function mapXenditToGenericBillingInformationDto(
  payload: XenditBillingInformationDto,
): BillingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postalCode: payload.postal_code,
    streetLine1: payload.street_line1,
    streetLine2: payload.street_line2,
    provinceState: payload.province_state,
  };
}

export function mapXenditToGenericRecurringConfiguration(
  payload: XenditRecurringConfigurationDto,
): RecurringConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    recurringExpiry: payload.recurring_expiry,
    recurringFrequency: payload.recurring_frequency,
  };
}

export function mapXenditToGenericInstallmentConfiguration(
  payload: XenditInstallmentConfigurationDto,
): InstallmentConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    terms: payload.terms,
    interval: payload.interval,
  };
}

export function mapXenditToGenericShippingConfiguration(
  payload: XenditShippingInformationDto,
): ShippingInformationDto {
  if (!payload) {
    return;
  }

  return {
    city: payload.city,
    country: payload.country,
    postalCode: payload.postal_code,
    streetLine1: payload.street_line1,
    streetLine2: payload.street_line2,
    provinceState: payload.province_state,
  };
}

export function mapXenditToGenericChannelPropertiesDto(
  payload: XenditChannelPropertiesDto,
): ChannelPropertiesDto {
  if (!payload) {
    return;
  }

  return {
    successReturnUrl: payload?.success_return_url,
    failureReturnUrl: payload?.failure_return_url,
    cancelReturnUrl: payload?.cancel_return_url,
    pendingReturnUrl: payload?.pending_return_url,
    expiresAt: payload?.expires_at,
    payerName: payload?.payer_name,
    displayName: payload?.display_name,
    paymentCode: payload?.payment_code,
    virtualAccountNumber: payload?.virtual_account_number,
    suggestedAmount: payload?.suggested_amount,
    cashtag: payload?.cashtag,
    cardDetails: mapXenditToGenericCardDetailsDto(payload?.card_details),
    midLabel: payload?.mid_label,
    skipThreeDs: payload?.skip_three_ds,
    cardOnFileType: payload?.card_on_file_type,
    billingInformation: mapXenditToGenericBillingInformationDto(
      payload?.billing_information,
    ),
    statementDescriptor: payload?.statement_descriptor,
    recurringConfiguration: mapXenditToGenericRecurringConfiguration(
      payload?.recurring_configuration,
    ),
    accountEmail: payload?.account_email,
    accountMobileNumber: payload?.account_mobile_number,
    cardLastFour: payload?.card_last_four,
    cardExpiry: payload?.card_expiry,
    accountIdentityNumber: payload?.account_identity_number,
    payerEmail: payload?.payer_email,
    deviceType: payload?.device_type,
    description: payload?.description,
    enableOtp: payload?.enable_otp,
    allowedPaymentOptions: payload?.allowed_payment_options,
    redeemPoints: payload?.redeem_points,
    payerIpAddress: payload?.payer_ip_address,
    installmentConfiguration: mapXenditToGenericInstallmentConfiguration(
      payload?.installment_configuration,
    ),
  };
}
