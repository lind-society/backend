import {
  CardsSessionJSDto,
  PaymentLinkConfigurationDto,
  RecurringConfigurationDto,
  SessionCardDto,
  SessionChannelPropertiesDto,
} from '@apps/main/modules/payment/dto';
import { CreatePaymentSessionDto } from '@apps/main/modules/payment/dto/payment-session/create-payment-session-request.dto';
import {
  XenditCardsSessionJSDto,
  XenditCreatePaymentSessionDto,
  XenditPaymentLinkConfigurationDto,
  XenditRecurringConfigurationDto,
  XenditSessionCardDto,
  XenditSessionChannelPropertiesDto,
} from '../../../dto';
import { mapGenericToXenditCreatePaymentCustomerDto } from '../customer/xendit-create-payment-customer-dto-mapper.dto';
import { mapGenericToXenditPaymentItemsDto } from '../item';

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

export function mapGenericToXenditSessionPaymentLinkConfigurationDto(
  payload: PaymentLinkConfigurationDto,
): XenditPaymentLinkConfigurationDto {
  if (!payload) {
    return;
  }

  return {
    primary_payment_channels: payload.primaryPaymentChannels,
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
    reference_id: payload.referenceId,
    customer_id: payload.customerId,
    customer: xenditCustomer,
    session_type: payload.sessionType,
    allow_save_payment_method: payload.allowSavePaymentMethod,
    currency: payload.currency,
    amount: payload.amount,
    mode: payload.mode,
    capture_method: payload.captureMethod,
    country: payload.country,
    channel_properties: mapGenericToCreateXenditSessionChannelPropertiesDto(
      payload.channelProperties,
    ),
    payment_link_configuration:
      mapGenericToXenditSessionPaymentLinkConfigurationDto(
        payload.paymentLinkConfiguration,
      ),
    allowed_payment_channels: payload.allowedPaymentChannels,
    expires_at: payload.expiresAt,
    locale: payload.locale,
    metadata: payload.metadata,
    description: payload.description,
    items: mapGenericToXenditPaymentItemsDto(payload.items),
    success_return_url: payload.successReturnUrl,
    cancel_return_url: payload.cancelReturnUrl,
    cards_session_js: mapGenericToCreateXenditCardSessionJSDto(
      payload.cardsSessionJS,
    ),
  };
}
