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
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Body() payload: CustomerRequest,
  ) {
    try {
      const response = await this.customerService.creatCustomer({
        idempotencyKey: idempotencyKeyHeader,
        data: payload,
      });

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
        const getCustomerPayload: GetCustomerRequest = { id };
        const response =
          await this.customerService.getCustomer(getCustomerPayload);

        return response;
      }

      if (referenceId) {
        const getCustomerPayload: GetCustomerByReferenceIDRequest = {
          referenceId,
        };
        const response =
          await this.customerService.getCustomerByReferenceId(
            getCustomerPayload,
          );
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
