import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerRequest, CustomerApi } from 'xendit-node/customer/apis';
import { CustomerRequest } from 'xendit-node/customer/models';
import {
  AuthPaymentMethodRequest,
  ExpirePaymentMethodRequest,
  GetAllPaymentMethodsRequest,
  GetPaymentMethodByIDRequest,
  GetPaymentsByPaymentMethodIdRequest,
  PatchPaymentMethodRequest,
  PaymentMethodApi,
} from 'xendit-node/payment_method/apis';
import {
  PaymentMethod,
  PaymentMethodList,
  PaymentMethodParameters,
} from 'xendit-node/payment_method/models';
import { CustomerService } from '../customer/customer.service';
import { ListPaymentDto, PaymentDto } from './dto/payment.dto';
import { plainToInstance } from 'class-transformer';

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
    @Inject('XENDIT_PAYMENT_METHOD_CLIENT')
    private readonly paymentMethodClient: PaymentMethodApi,
    private customerService: CustomerService,
  ) {}

  private _sanitizeGetPaymentsByPaymentMethodIdRequestPayload(
    getPaymentsByPaymentMethodIdRequestPayload: GetPaymentsByPaymentMethodIdRequest,
  ): GetPaymentsByPaymentMethodIdRequest {
    const sanitizedPaymentRequestPayload = {
      ...getPaymentsByPaymentMethodIdRequestPayload,
    };

    if (sanitizedPaymentRequestPayload.createdGte) {
      sanitizedPaymentRequestPayload.createdGte = new Date(
        sanitizedPaymentRequestPayload.createdGte,
      );
    }

    if (sanitizedPaymentRequestPayload.createdLte) {
      sanitizedPaymentRequestPayload.createdLte = new Date(
        sanitizedPaymentRequestPayload.createdLte,
      );
    }

    if (sanitizedPaymentRequestPayload.updatedGte) {
      sanitizedPaymentRequestPayload.updatedGte = new Date(
        sanitizedPaymentRequestPayload.updatedGte,
      );
    }

    if (sanitizedPaymentRequestPayload.updatedLte) {
      sanitizedPaymentRequestPayload.updatedLte = new Date(
        sanitizedPaymentRequestPayload.updatedLte,
      );
    }

    return sanitizedPaymentRequestPayload;
  }

  async createPaymentMethod(
    paymentMethodPayload: PaymentMethodParameters,
    customerPayload: CreateCustomerRequest,
  ): Promise<PaymentMethod> {
    /*
      1. check auth (get user_id)

      2. 
        a. if user has customer_id, skip creating customer
        b. if not, assign customer_id to user table (customer_id column)

      3. continue creating payment method

      4. store in db payment_method_id, channel_code, currency, user_id (fk)
    **/

    // const customer = await this.customerService.creatCustomer({
    //   ...customerPayload,
    //   idempotencyKey: crypto.randomUUID(),
    // });

    // paymentMethodPayload.customerId = customer.id;

    const paymentMethod = await this.paymentMethodClient.createPaymentMethod({
      data: paymentMethodPayload,
    });

    // user has one to many relation with payment method (1 user can have multiple payment methods)

    return paymentMethod;
  }

  async getAllPaymentMethod(
    payload: GetAllPaymentMethodsRequest,
  ): Promise<PaymentMethodList> {
    const paymentMethods =
      await this.paymentMethodClient.getAllPaymentMethods(payload);

    return paymentMethods;
  }

  async getPaymentMethodById(paymentMethodId: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodClient.getPaymentMethodByID({
      paymentMethodId,
    });

    return paymentMethod;
  }

  async getPaymentsByPaymentMethodId(
    paymentMethodId: string,
    payload: GetPaymentsByPaymentMethodIdRequest,
  ): Promise<PaymentDto | object> {
    payload.paymentMethodId = paymentMethodId;

    const sanitizedPaymentRequestPayload =
      this._sanitizeGetPaymentsByPaymentMethodIdRequestPayload(payload);

    const payments =
      (await this.paymentMethodClient.getPaymentsByPaymentMethodId(
        sanitizedPaymentRequestPayload,
      )) as ListPaymentDto;

    return payments.data instanceof PaymentDto
      ? payments
      : plainToInstance(PaymentDto, payments.data);
  }

  async updatePaymentMethod(
    payload: PatchPaymentMethodRequest,
  ): Promise<PaymentMethod> {
    const paymentMethod =
      await this.paymentMethodClient.patchPaymentMethod(payload);

    return paymentMethod;
  }

  async expirePaymentMethod(
    payload: ExpirePaymentMethodRequest,
  ): Promise<PaymentMethod> {
    const paymentMethod =
      await this.paymentMethodClient.expirePaymentMethod(payload);

    return paymentMethod;
  }

  async authorizePaymentMethod(
    payload: AuthPaymentMethodRequest,
  ): Promise<PaymentMethod> {
    const paymentMethod =
      await this.paymentMethodClient.authPaymentMethod(payload);

    return paymentMethod;
  }
}
