import {
  CreatePaymentInvoiceDto,
  CreatePaymentRequestDto,
  CreateSimulatePaymentDto,
  InvoiceCallbackDto,
  PaymentInvoiceDto,
  PaymentRequestDto,
  SimulatePaymentDto,
} from '../dto';
import { CreatePaymentSessionDto } from '../dto/card-payment/create-payment-session-request.dto';
import { PaymentSessionDto } from '../dto/card-payment/payment-session.dto';

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

  // callbacks
  receiveInvoiceCallback(payload: InvoiceCallbackDto): Promise<any>;

  // simulations
  simulatePayment(
    paymentRequestId: string,
    payload?: CreateSimulatePaymentDto,
  ): Promise<SimulatePaymentDto>;
}
