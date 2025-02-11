import { Inject, Injectable } from '@nestjs/common';
import { CustomerApi } from 'xendit-node/customer/apis';
import { PaymentMethodApi } from 'xendit-node/payment_method/apis';
import { PaymentMethodParameters } from 'xendit-node/payment_method/models';

/* 
  This service is used to save a payment method each user
  Documentations
    - Customer
      - https://developers.xendit.co/api-reference/#customers
      - https://github.com/xendit/xendit-node/blob/master/docs/Customer.md

    - Payment Method
      - https://github.com/xendit/xendit-node/blob/master/docs/PaymentMethod.md
      - https://developers.xendit.co/api-reference/payments-api/#create-payment-method
**/
@Injectable()
export class PaymentMethodService {
  constructor(
    @Inject('XENDIT_CUSTOMER_CLIENT')
    private readonly customerClient: CustomerApi,
    @Inject('XENDIT_PAYMENT_METHOD_CLIENT')
    private readonly paymentMethodClient: PaymentMethodApi,
  ) {}

  async createPaymentMethod(payload: PaymentMethodParameters) {
    // get payload

    // create customer -> refer to this doc
    const customer = await this.customerClient.createCustomer();

    // create if statement based on payment type

    // process needed value of other payload based on the payment type
  }
}
