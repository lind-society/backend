import {
  CardsSessionJSDto,
  RecurringConfigurationDto,
  SessionCardDto,
  SessionChannelPropertiesDto,
} from '@apps/main/modules/payment/dto';
import { CreatePaymentSessionDto } from '@apps/main/modules/payment/dto/card-payment/create-payment-session-request.dto';
import { PaymentSessionDto } from '@apps/main/modules/payment/dto/card-payment/payment-session.dto';
import {
  XenditCardsSessionJSDto,
  XenditCreatePaymentSessionDto,
  XenditPaymentSessionDto,
  XenditRecurringConfigurationDto,
  XenditSessionCardDto,
  XenditSessionChannelPropertiesDto,
} from '../../../dto';
import { mapGenericToXenditCreatePaymentCustomerDto } from '../customer/xendit-create-payment-customer-dto-mapper.dto';

export function mapGenericToXenditRecurringConfigurationDto(
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

export function mapGenericToXenditSessionCardDto(
  payload: SessionCardDto,
): XenditSessionCardDto {
  if (!payload) {
    return;
  }

  return {
    card_on_file_type: payload.cardOnFileType,
    mid_label: payload.midLabel,
    allowed_bins: payload.allowedBins,
    skip_three_ds: payload.skipThreeDs,
    recurring_configuration: mapGenericToXenditRecurringConfigurationDto(
      payload.recurringConfiguration,
    ),
    statement_descriptor: payload.statementDescriptor,
  };
}

export function mapGenericToCreateXenditSessionChannelPropertiesDto(
  payload: SessionChannelPropertiesDto,
): XenditSessionChannelPropertiesDto {
  if (!payload) {
    return;
  }

  return {
    cards: mapGenericToXenditSessionCardDto(payload.cards),
  };
}

export function mapGenericToCreateXenditCardSessionJSDto(
  payload: CardsSessionJSDto,
): XenditCardsSessionJSDto {
  if (!payload) {
    return;
  }

  return {
    success_return_url: payload.successReturnUrl,
    failure_return_url: payload.failureReturnUrl,
  };
}

export function mapGenericToXenditCreatePaymentSessionDto(
  payload: CreatePaymentSessionDto,
): XenditCreatePaymentSessionDto {
  if (!payload) {
    return;
  }

  const xenditCustomer = mapGenericToXenditCreatePaymentCustomerDto(
    payload.customer,
  );

  return {
    reference_id: `${payload.referenceId}_${Date.now()}`,
    customer_id: payload.customerId,
    customer: xenditCustomer,
    session_type: payload.sessionType,
    allow_save_payment_method: payload.allowSavePaymentMethod,
    currency: payload.currency,
    amount: payload.amount,
    mode: payload.mode,
    country: payload.country,
    channel_properties: mapGenericToCreateXenditSessionChannelPropertiesDto(
      payload.channelProperties,
    ),
    allowed_payment_channels: payload.allowedPaymentChannels,
    expires_at: payload.expiresAt,
    locale: payload.locale,
    metadata: payload.metadata,
    description: payload.description,
    success_return_url: payload.successReturnUrl,
    cancel_return_url: payload.cancelReturnUrl,
    cards_session_js: mapGenericToCreateXenditCardSessionJSDto(
      payload.cardsSessionJS,
    ),
  };
}

// Xendit To Generic

export function mapXenditToGenericRecurringConfigurationDto(
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

export function mapXenditToGenericSessionCardDto(
  payload: XenditSessionCardDto,
): SessionCardDto {
  if (!payload) {
    return;
  }

  return {
    cardOnFileType: payload.card_on_file_type,
    midLabel: payload.mid_label,
    allowedBins: payload.allowed_bins,
    skipThreeDs: payload.skip_three_ds,
    recurringConfiguration: mapXenditToGenericRecurringConfigurationDto(
      payload.recurring_configuration,
    ),
    statementDescriptor: payload.statement_descriptor,
  };
}

export function mapXenditToGenericSessionChannelPropertiesDto(
  payload: XenditSessionChannelPropertiesDto,
): SessionChannelPropertiesDto {
  if (!payload) {
    return;
  }

  return {
    cards: mapXenditToGenericSessionCardDto(payload.cards),
  };
}

export function mapXenditToGenericCardSessionJSDto(
  payload: XenditCardsSessionJSDto,
): CardsSessionJSDto {
  if (!payload) {
    return;
  }

  return {
    successReturnUrl: payload.success_return_url,
    failureReturnUrl: payload.failure_return_url,
  };
}

export function mapXenditToGenericCreatePaymentSessionResponse(
  payload: XenditPaymentSessionDto,
): PaymentSessionDto {
  if (!payload) {
    return;
  }

  return {
    paymentSessionId: payload.payment_session_id,
    created: payload.created,
    updated: payload.updated,
    referenceId: payload.reference_id,
    currency: payload.currency,
    amount: payload.amount,
    country: payload.country,
    customerId: payload.customer_id,
    expiresAt: payload.expires_at,
    sessionType: payload.session_type,
    mode: payload.mode,
    locale: payload.locale,
    businessId: payload.business_id,
    allowSavePaymentMethod: payload.allow_save_payment_method,
    channelProperties: mapXenditToGenericSessionChannelPropertiesDto(
      payload.channel_properties,
    ),
    allowedPaymentChannels: [],
    metadata: payload.metadata,
    successReturnUrl: payload.success_return_url,
    cancelReturnUrl: payload.cancel_return_url,
    status: payload.status,
    paymentLinkUrl: payload.payment_link_url,
    paymentTokenId: payload.payment_token_id,
    paymentRequestId: payload.payment_request_id,
    cardsSessionJS: mapXenditToGenericCardSessionJSDto(
      payload.cards_session_js,
    ),
  };
}
