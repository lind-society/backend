import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCustomerRequest } from 'xendit-node/customer/apis';
import {
  AuthPaymentMethodRequest,
  ExpirePaymentMethodRequest,
  GetAllPaymentMethodsRequest,
  GetPaymentsByPaymentMethodIdRequest,
  PatchPaymentMethodRequest,
} from 'xendit-node/payment_method/apis';
import {
  PaymentMethodAuthParameters,
  PaymentMethodExpireParameters,
  PaymentMethodUpdateParameters,
} from 'xendit-node/payment_method/models';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async createPaymentMethod(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Body() payload: CreatePaymentMethodDto,
  ) {
    try {
      const customerPayload: CreateCustomerRequest = {
        idempotencyKey: idempotencyKeyHeader,
        data: payload.customerPayload,
      };

      const result = await this.paymentMethodService.createPaymentMethod(
        payload.paymentMethodPayload,
        customerPayload,
      );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get()
  async getAllPayment(@Body() payload: GetAllPaymentMethodsRequest) {
    try {
      const result =
        await this.paymentMethodService.getAllPaymentMethod(payload);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id/payments')
  async getPaymentsByPaymentMethodId(
    @Param('id') paymentMethodId: string,
    @Body() payload: GetPaymentsByPaymentMethodIdRequest,
  ) {
    try {
      payload.paymentMethodId = paymentMethodId;

      const result =
        await this.paymentMethodService.getPaymentsByPaymentMethodId(
          paymentMethodId,
          payload,
        );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getPaymentMethodById(@Param('id') paymentMethodId: string) {
    try {
      const result =
        await this.paymentMethodService.getPaymentMethodById(paymentMethodId);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Patch(':id')
  async updatePaymentMethod(
    @Param('id') paymentMethodId: string,
    @Body() payload: PaymentMethodUpdateParameters,
  ) {
    try {
      const updatePaymentMethodPayload: PatchPaymentMethodRequest = {
        paymentMethodId,
        data: payload,
      };

      const result = await this.paymentMethodService.updatePaymentMethod(
        updatePaymentMethodPayload,
      );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Patch(':id/expire')
  async expirePaymentMethod(
    @Param('id') paymentMethodId: string,
    @Body() payload: PaymentMethodExpireParameters,
  ) {
    try {
      const expirePaymentMethodPayload: ExpirePaymentMethodRequest = {
        paymentMethodId,
        data: payload,
      };

      const result = await this.paymentMethodService.expirePaymentMethod(
        expirePaymentMethodPayload,
      );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/authorize')
  async authorizePaymentMethod(
    @Param('id') paymentMethodId: string,
    @Body() payload: PaymentMethodAuthParameters,
  ) {
    try {
      const authorizePaymentMethodPayload: AuthPaymentMethodRequest = {
        paymentMethodId,
        data: payload,
      };

      const result = await this.paymentMethodService.authorizePaymentMethod(
        authorizePaymentMethodPayload,
      );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/simulate-payment')
  async simulatePaymentRequest(@Param('id') id: string) {
    try {
      const result = await this.paymentMethodService.simulatePaymentMethod(id);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
