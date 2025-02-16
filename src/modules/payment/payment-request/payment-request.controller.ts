import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { PaymentRequestParameters } from 'xendit-node/payment_request/models';
import { CreatePaymentRequestRequest } from 'xendit-node/payment_request/apis';

@Controller('payment/payment-request')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}

  @Post()
  async createPaymentRequest(
    @Headers() headers: CreatePaymentRequestRequest,
    @Body() payload: PaymentRequestParameters,
  ) {
    const idempotencyKey = headers['idempotency-key'] || crypto.randomUUID();

    try {
      const paymentRequests: CreatePaymentRequestRequest = {
        idempotencyKey,
        data: payload,
      };

      const response =
        await this.paymentRequestService.createPaymentRequest(paymentRequests);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
