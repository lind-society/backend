import {
  CardsSessionJSDto,
  PaymentLinkConfigurationDto,
  RecurringConfigurationDto,
  SessionCardDto,
  SessionChannelPropertiesDto,
} from '@apps/main/modules/payment/dto';
import { PaymentSessionDto } from '@apps/main/modules/payment/dto/payment-session/payment-session.dto';
import {
  XenditCardsSessionJSDto,
  XenditPaymentLinkConfigurationDto,
  XenditPaymentSessionDto,
  XenditRecurringConfigurationDto,
  XenditSessionCardDto,
  XenditSessionChannelPropertiesDto,
} from '../../../dto';
import { mapXenditToGenericPaymentItemsDto } from '../item';

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

export function mapXenditToGenericSessionPaymentLinkConfigurationDto(
  payload: XenditPaymentLinkConfigurationDto,
): PaymentLinkConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    primaryPaymentChannels: payload.primary_payment_channels,
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

export function mapXenditToGenericPaymentSessionDto(
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
    customerId: payload.customer_id,
    sessionType: payload.session_type,
    allowSavePaymentMethod: payload.allow_save_payment_method,
    currency: payload.currency,
    amount: payload.amount,
    country: payload.country,
    mode: payload.mode,
    captureMethod: payload.capture_method,
    channelProperties: mapXenditToGenericSessionChannelPropertiesDto(
      payload.channel_properties,
    ),
    paymentLinkConfiguration:
      mapXenditToGenericSessionPaymentLinkConfigurationDto(
        payload.payment_link_configuration,
      ),
    allowedPaymentChannels: payload.allowed_payment_channels,
    expiresAt: payload.expires_at,
    locale: payload.locale,
    metadata: payload.metadata,
    description: payload.description,
    items: mapXenditToGenericPaymentItemsDto(payload.items),
    successReturnUrl: payload.success_return_url,
    cancelReturnUrl: payload.cancel_return_url,
    status: payload.status,
    paymentLinkUrl: payload.payment_link_url,
    paymentTokenId: payload.payment_token_id,
    paymentId: payload.payment_id,
    paymentRequestId: payload.payment_request_id,
    businessId: payload.business_id,
    cardsSessionJS: mapXenditToGenericCardSessionJSDto(
      payload.cards_session_js,
    ),
  };
}
