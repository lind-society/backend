import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  GetAllPaymentRequestsRequest,
  GetPaymentRequestCapturesRequest,
} from 'xendit-node/payment_request/apis';
import {
  CaptureParameters,
  PaymentRequestAuthParameters,
  PaymentRequestParameters,
} from 'xendit-node/payment_request/models';
import { PaymentRequestService } from './payment-request.service';

@Controller('payment/payment-request')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}

  @Post()
  async createPaymentRequest(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Body() payload: PaymentRequestParameters,
  ) {
    try {
      const response = await this.paymentRequestService.createPaymentRequest({
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
  async getPaymentRequestById(@Param('id') paymentRequestId: string) {
    try {
      const result =
        await this.paymentRequestService.getPaymentRequestById(
          paymentRequestId,
        );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getAllPaymentRequest(@Body() payload: GetAllPaymentRequestsRequest) {
    try {
      const result =
        await this.paymentRequestService.getAllPaymentRequest(payload);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id/captures')
  async getPaymentRequestCaptures(
    @Param('id') paymentRequestId: string,
    @Body() payload: GetPaymentRequestCapturesRequest,
  ) {
    try {
      const result = await this.paymentRequestService.getPaymentRequestCaptures(
        {
          paymentRequestId,
          limit: payload.limit,
        },
      );

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/capture')
  async capturePaymentRequest(
    @Param('id') id: string,
    @Body() payload: CaptureParameters,
  ) {
    try {
      const result = await this.paymentRequestService.capturePaymentRequest({
        paymentRequestId: id,
        data: payload,
      });

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/authorize')
  async authorizePaymentRequest(
    @Param('id') id: string,
    @Body() payload: PaymentRequestAuthParameters,
  ) {
    try {
      const result = await this.paymentRequestService.authorizePaymentRequest({
        paymentRequestId: id,
        data: payload,
      });

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/authorize')
  async resendPaymentRequestAuth(@Param('id') id: string) {
    try {
      const result =
        await this.paymentRequestService.resendPaymentRequestAuth(id);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
