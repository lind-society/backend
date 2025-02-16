import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerRequest,
  GetCustomerByReferenceIDRequest,
  GetCustomerRequest,
  UpdateCustomerRequest,
} from 'xendit-node/customer/apis';
import { CustomerRequest, PatchCustomer } from 'xendit-node/customer/models';

@Controller('payment/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Headers() headers: CreateCustomerRequest,
    @Body() payload: CustomerRequest,
  ) {
    const idempotencyKey = headers['idempotency-key'] || crypto.randomUUID();

    try {
      const paymentRequests: CreateCustomerRequest = {
        idempotencyKey,
        data: payload,
      };

      const response =
        await this.customerService.creatCustomer(paymentRequests);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get()
  async getCustomer(
    @Query('id') id?: string,
    @Query('reference_id') referenceId?: string,
  ) {
    try {
      if (id) {
        const payload: GetCustomerRequest = { id };
        const response = await this.customerService.getCustomer(payload);

        return response;
      }

      if (referenceId) {
        const payload: GetCustomerByReferenceIDRequest = { referenceId };
        const response =
          await this.customerService.getCustomerByReferenceId(payload);
        return response;
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() payload: PatchCustomer,
  ) {
    try {
      const updateCustomerPayload: UpdateCustomerRequest = {
        id,
        data: payload,
      };

      const response = await this.customerService.updateCustomer(
        updateCustomerPayload,
      );

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
