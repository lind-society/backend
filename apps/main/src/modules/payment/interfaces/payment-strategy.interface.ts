import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto,
  InvoiceCallbackDto,
} from '../dto';
import { CreatePaymentSessionRequestDto } from '../dto/card-payment/create-payment-session-request.dto';
import { CreatePaymentSessionResponseDto } from '../dto/card-payment/create-payment-session-response.dto';

export interface IPaymentStrategy {
  createInvoice(
    payload: CreateInvoiceRequestDto,
  ): Promise<CreateInvoiceResponseDto>;
  createPaymentRequest(payload: any): Promise<any>;
  createPaymentSession(
    payload: CreatePaymentSessionRequestDto,
  ): Promise<CreatePaymentSessionResponseDto>;

  // invoice related method
  receiveInvoiceCallback(payload: InvoiceCallbackDto): Promise<any>;
}
