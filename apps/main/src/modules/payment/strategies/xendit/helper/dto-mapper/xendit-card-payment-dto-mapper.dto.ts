import { CreatePaymentSessionRequestDto } from '@apps/main/modules/payment/dto/card-payment/create-payment-session-request.dto';
import { CreatePaymentSessionResponseDto } from '@apps/main/modules/payment/dto/card-payment/create-payment-session-response.dto';
import { XenditCreatePaymentSessionRequestDto } from '../../dto/card-payment/xendit-create-payment-session-request.dto';
import { XenditCreatePaymentSessionResponseDto } from '../../dto/card-payment/xendit-create-payment-session-response.dto';
import { mapGenericToXenditCustomerDto } from './customer/xendit-customer-dto-mapper.dto';

export function mapGenericToCreateXenditCreatePaymentSessionRequest(
  payload: CreatePaymentSessionRequestDto,
): XenditCreatePaymentSessionRequestDto {
  const xenditCustomer = mapGenericToXenditCustomerDto(payload.customer);

  return {
    reference_id: `${payload.referenceId}_${Date.now()}`,
    session_type: payload.sessionType,
    mode: payload.mode,
    amount: payload.amount,
    currency: payload.currency,
    country: payload.country,
    customer: xenditCustomer,
    cards_session_js: {
      success_return_url: `https://radically-pleased-kit.ngrok-free.app/api/v1/bookings/${payload.referenceId}`,
      failure_return_url: `https://radically-pleased-kit.ngrok-free.app/api/v1/bookings/${payload.referenceId}`,
    },
  };
}

export function mapXenditToGenericCreateXenditCreatePaymentSessionResponse(
  payload: XenditCreatePaymentSessionResponseDto,
): CreatePaymentSessionResponseDto {
  return {
    payment_session_id: payload.payment_session_id,
    created: payload.created,
    updated: payload.updated,
    reference_id: payload.reference_id,
    currency: payload.currency,
    amount: payload.amount,
    country: payload.country,
    customer_id: payload.customer_id,
    expires_at: payload.expires_at,
    session_type: payload.session_type,
    mode: payload.mode,
    locale: payload.locale,
    business_id: payload.business_id,
    redirectUrls: {
      successReturnUrl: payload.cards_session_js.success_return_url,
      failureReturnUrl: payload.cards_session_js.failure_return_url,
    },
  };
}
