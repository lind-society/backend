import {
  CreatePaymentRequestDto,
  CreatePaymentTokenDto,
  CreateSimulatePaymentDto,
  PaymentDto,
  PaymentRequestDto,
  PaymentTokenDto,
  SimulatePaymentDto,
} from '../dto';
import { CreatePaymentSessionDto } from '../dto/payment-session/create-payment-session-request.dto';
import { PaymentSessionDto } from '../dto/payment-session/payment-session.dto';
import { CreatePaymentRefundDto, PaymentRefundDto } from '../dto/refund';
import {
  XenditPaymentRequestCallbackDto,
  XenditPaymentSessionCallbackDto,
  XenditPaymentTokenCallbackDto,
} from '../strategies/xendit/dto';
import { XenditPaymentRefundCallbackDto } from '../strategies/xendit/dto/refund';

export interface IPaymentStrategy {
  // payment request
  createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<PaymentRequestDto>;
  getPaymentRequestDetail(paymentRequestId: string): Promise<PaymentRequestDto>;
  cancelPaymentRequest(paymentRequestId: string): Promise<PaymentRequestDto>;
  simulatePayment(
    paymentRequestId: string,
    payload?: CreateSimulatePaymentDto,
  ): Promise<SimulatePaymentDto>;
  receivePaymentRequestCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void>;

  // payment session
  createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto>;
  getPaymentSessionDetail(paymentSessionId: string): Promise<PaymentSessionDto>;
  cancelPaymentSession(paymentSessionId: string): Promise<PaymentSessionDto>;
  receivePaymentSessionCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentSessionCallbackDto,
  ): Promise<void>;

  // payment
  getPaymentDetail(paymentId: string): Promise<PaymentDto>;
  cancelPayment(paymentId: string): Promise<PaymentDto>;
  capturePayment(paymentId: string): Promise<PaymentDto>;

  // payment token
  createPaymentToken(payload: CreatePaymentTokenDto): Promise<PaymentTokenDto>;
  getPaymentTokenDetail(paymentTokenId: string): Promise<PaymentTokenDto>;
  cancelPaymentToken(paymentTokenId: string): Promise<PaymentTokenDto>;
  receivePaymentTokenCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentTokenCallbackDto,
  ): Promise<void>;

  // refunds
  createPaymentRefund(
    payload: CreatePaymentRefundDto,
  ): Promise<PaymentRefundDto>;
  receivePaymentRefundCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentRefundCallbackDto,
  ): Promise<void>;

  // deprecated

  /* invoice
  createInvoice(payload: CreatePaymentInvoiceDto): Promise<PaymentInvoiceDto>;
  receiveInvoiceCallback(
    payload: XenditPaymentInvoiceCallbackDto,
  ): Promise<void>;
  */
}
