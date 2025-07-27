// payment event constants
export const PAYMENT_CAPTURE = 'payment.capture';
export const PAYMENT_AUTHORIZATION = 'payment.authorization';
export const PAYMENT_FAILURE = 'payment.failure';

export enum PaymentAvailableCallbackEvent {
  PaymentCapture = PAYMENT_CAPTURE,
  PaymentAuthorization = PAYMENT_AUTHORIZATION,
  PaymentFailure = PAYMENT_FAILURE,
}
