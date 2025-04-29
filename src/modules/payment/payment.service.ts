import { Injectable } from '@nestjs/common';
import { InvoiceCallback } from 'xendit-node/invoice/models';
import { PaymentMethodCallback } from 'xendit-node/payment_method/models';
import { PaymentCallback } from 'xendit-node/payment_request/models';

@Injectable()
export class PaymentService {
  async paymentInvoiceCallback(
    callbackResponse: InvoiceCallback,
  ): Promise<InvoiceCallback> {
    console.log('Invoice Callback Response :\n', callbackResponse);

    return callbackResponse;
  }

  async paymentRequestCallback(
    callbackResponse: PaymentCallback,
  ): Promise<PaymentCallback> {
    console.log('Payment Request Callback Response :\n', callbackResponse);

    return callbackResponse;
  }

  async paymentMethodCallback(
    callbackResponse: PaymentMethodCallback,
  ): Promise<PaymentMethodCallback> {
    console.log('Payment Method Callback Response :\n', callbackResponse);

    return callbackResponse;
  }
}
