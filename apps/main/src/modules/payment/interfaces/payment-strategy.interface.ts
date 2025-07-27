import {
  CreatePaymentInvoiceDto,
  CreatePaymentRequestDto,
  CreateSimulatePaymentDto,
  PaymentInvoiceDto,
  PaymentRequestDto,
  SimulatePaymentDto,
} from '../dto';
import { CreatePaymentSessionDto } from '../dto/card-payment/create-payment-session-request.dto';
import { PaymentSessionDto } from '../dto/card-payment/payment-session.dto';
import {
  XenditInvoiceCallbackDto,
  XenditPaymentRequestCallbackDto,
} from '../strategies/xendit/dto';

export interface IPaymentStrategy {
  // invoice
  createInvoice(payload: CreatePaymentInvoiceDto): Promise<PaymentInvoiceDto>;

  // payment request
  createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<PaymentRequestDto>;
  getPaymentRequestDetail(paymentRequestId: string): Promise<PaymentRequestDto>;
  cancelPaymentRequest(paymentRequestId: string): Promise<PaymentRequestDto>;

  // card payment
  createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto>;

  // callbacks (currently using xendit as payment gateway, so receive the payload as the xendit payload)
  receivePaymentRequestCallback(
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void>;
  receiveInvoiceCallback(payload: XenditInvoiceCallbackDto): Promise<void>;

  // simulations
  simulatePayment(
    paymentRequestId: string,
    payload?: CreateSimulatePaymentDto,
  ): Promise<SimulatePaymentDto>;
}
