import { Injectable } from '@nestjs/common';
import { InvoiceCallback } from 'xendit-node/invoice/models';

@Injectable()
export class PaymentService {
  async paymentCallback(
    callbackResponse: InvoiceCallback,
  ): Promise<InvoiceCallback> {
    console.log('callbackResponse :\n', callbackResponse);

    return callbackResponse;
  }
}
