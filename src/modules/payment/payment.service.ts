import { Injectable } from '@nestjs/common';
import { InvoiceCallback } from 'xendit-node/invoice/models';

/*
  Referring to xendit SDK docs : https://github.com/xendit/xendit-node?tab=readme-ov-file#documentation
  Available features in SDK :
    1. Balance          (Implemented, Done)     -> https://github.com/xendit/xendit-node/blob/master/docs/Balance.md
    2. Customer         (Implemented, Ongoing)  -> https://github.com/xendit/xendit-node/blob/master/docs/Customer.md
    3. Invoice          (Implemented, Done)     -> https://github.com/xendit/xendit-node/blob/master/docs/Invoice.md
    4. Payment Method   (Implemented, Ongoing)  -> https://github.com/xendit/xendit-node/blob/master/docs/PaymentMethod.md
    5. Payment Request  (Implemented, Ongoing)  -> https://github.com/xendit/xendit-node/blob/master/docs/PaymentRequest.md
    6. Payout           (Not Implemented)       -> https://github.com/xendit/xendit-node/blob/master/docs/Payout.md
    7. Refund           (Not Implemented)       -> https://github.com/xendit/xendit-node/blob/master/docs/Refund.md
    8. Transaction      (Not Implemented)       -> https://github.com/xendit/xendit-node/blob/master/docs/Transaction.md
**/

@Injectable()
export class PaymentService {
  async paymentCallback(
    callbackResponse: InvoiceCallback,
  ): Promise<InvoiceCallback> {
    console.log('callbackResponse :\n', callbackResponse);

    return callbackResponse;
  }
}
