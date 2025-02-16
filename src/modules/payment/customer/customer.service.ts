import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCustomerRequest,
  CustomerApi,
  GetCustomerByReferenceIDRequest,
  GetCustomerRequest,
  UpdateCustomerRequest,
} from 'xendit-node/customer/apis';
import {
  Customer,
  GetCustomerByReferenceID200Response,
} from 'xendit-node/customer/models';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('XENDIT_CUSTOMER_CLIENT')
    private readonly customerClient: CustomerApi,
  ) {}

  async creatCustomer(payload: CreateCustomerRequest): Promise<Customer> {
    const customer: Customer =
      await this.customerClient.createCustomer(payload);

    return customer;
  }

  async getCustomer(payload: GetCustomerRequest): Promise<Customer> {
    const customer: Customer = await this.customerClient.getCustomer(payload);

    return customer;
  }

  async getCustomerByReferenceId(
    payload: GetCustomerByReferenceIDRequest,
  ): Promise<GetCustomerByReferenceID200Response> {
    const customer: GetCustomerByReferenceID200Response =
      await this.customerClient.getCustomerByReferenceID(payload);

    return customer;
  }

  async updateCustomer(payload: UpdateCustomerRequest): Promise<Customer> {
    const customer: Customer =
      await this.customerClient.updateCustomer(payload);

    return customer;
  }
}
