import { Injectable } from '@nestjs/common';

/* 
  This service is use for making a payment request, whether based on a new created payment method or refering to the created payment method (if want to use user payment prefernece)
  Documentations
    - https://developers.xendit.co/api-reference/payments-api/#create-payment-request
    - https://github.com/xendit/xendit-node/blob/master/docs/PaymentRequest.md
**/
@Injectable()
export class PaymentRequestService {}
