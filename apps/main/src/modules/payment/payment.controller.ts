import { SkipHal } from '@apps/main/common/decorators';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  CreatePaymentRefundDto,
  CreatePaymentRequestDto,
  CreatePaymentSessionDto,
  CreatePaymentTokenDto,
  CreateSimulatePaymentDto,
} from './dto';
import { PaymentService } from './payment.service';
import {
  XenditPaymentRequestCallbackDto,
  XenditPaymentTokenCallbackDto,
} from './strategies/xendit/dto';
import { XenditPaymentRefundCallbackDto } from './strategies/xendit/dto/refund';

@SkipHal()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Payment Request
  @Post('request')
  async createPaymentRequest(@Body() payload: CreatePaymentRequestDto) {
    return await this.paymentService.createPaymentRequest(payload);
  }

  @Get('/request/:paymentRequestId')
  async getPaymetRequestDetail(
    @Param('paymentRequestId') paymentRequestId: string,
  ) {
    const result =
      await this.paymentService.getPaymentRequestDetail(paymentRequestId);

    return result;
  }

  @Post('request/:paymentRequestId/cancel')
  async cancelPaymetRequest(
    @Param('paymentRequestId') paymentRequestId: string,
  ) {
    const result =
      await this.paymentService.cancelPaymentRequest(paymentRequestId);

    return result;
  }

  @Post('request/:paymentRequestId/simulate')
  async simulatePayment(
    @Param('paymentRequestId') paymentRequestId: string,
    @Body() payload: CreateSimulatePaymentDto,
  ) {
    const result = await this.paymentService.simulatePayment(
      paymentRequestId,
      payload,
    );

    return result;
  }

  @Post('request/callback')
  async paymentRequestCallback(
    @Headers('x-callback-token') webhookVerificationToken: string,
    @Body() payload: XenditPaymentRequestCallbackDto,
  ) {
    await this.paymentService.receivePaymentRequestCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment Refund
  @Post('refund')
  async createPaymentRefund(@Body() payload: CreatePaymentRefundDto) {
    return await this.paymentService.createPaymentRefund(payload);
  }

  @Post('refund/callback')
  async paymentRefundCallback(
    @Headers('x-callback-token') webhookVerificationToken: string,
    @Body() payload: XenditPaymentRefundCallbackDto,
  ) {
    await this.paymentService.receivePaymentRefundCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment Session
  @Post('session')
  async createPaymentSession(@Body() payload: CreatePaymentSessionDto) {
    return await this.paymentService.createPaymentSession(payload);
  }

  @Get('session/:paymentSessionId')
  async getPaymentSessionDetail(@Param('paymentSessionId') paymentSessionId: string) {
    return await this.paymentService.getPaymentSessionDetail(paymentSessionId);
  }

  @Post('session/:paymentSessionId/cancel')
  async cancelPaymentSession(@Param('paymentSessionId') paymentSessionId: string) {
    return await this.paymentService.cancelPaymentSession(paymentSessionId);
  }

  @Post('session/callback')
  async paymentSessionCallback(
    @Headers('x-callback-token') webhookVerificationToken: string,
    @Body() payload: XenditPaymentRequestCallbackDto,
  ) {
    await this.paymentService.receivePaymentRequestCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment
  @Get(':paymentId')
  async getPaymentDetail(@Param('paymentId') paymentId: string) {
    return await this.paymentService.getPaymentDetail(paymentId);
  }

  @Post(':paymentId/cancel')
  async cancelPayment(@Param('paymentId') paymentId: string) {
    return await this.paymentService.cancelPayment(paymentId);
  }

  @Post(':paymentId/capture')
  async capturePayment(@Param('paymentId') paymentId: string) {
    return await this.paymentService.capturePayment(paymentId);
  }

  // Payment Token
  @Post('token')
  async createPaymentToken(@Body() payload: CreatePaymentTokenDto) {
    return await this.paymentService.createPaymentToken(payload);
  }

  @Get('token/:paymentTokenId')
  async getPaymentTokenDetail(@Param('paymentTokenId') paymentTokenId: string) {
    return await this.paymentService.getPaymentTokenDetail(paymentTokenId);
  }

  @Post('token/:paymentTokenId/cancel')
  async cancelPaymentToken(@Param('paymentTokenId') paymentTokenId: string) {
    return await this.paymentService.cancelPaymentToken(paymentTokenId);
  }

  @Post('token/callback')
  async paymentTokenCallback(
    @Headers('x-callback-token') webhookVerificationToken: string,
    @Body() payload: XenditPaymentTokenCallbackDto,
  ) {
    await this.paymentService.receivePaymentTokenCallback(
      webhookVerificationToken,
      payload,
    );
  }
}

// deprecated

/* Invoice
  @Post('payments/payment-invoice/callback')
  async paymentInvoiceCallback(@Body() payload: any) {
    try {
      await this.paymentService.receiveInvoiceCallback(payload);
      return {
        success: true,
        data: payload,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response.data,
      };
    }
  }

  @Post('invoice/:provider')
  async createInvoiceWithSpecificProvider(
    @Param('provider') provider: PaymentGatewayProvider,
    @Body() invoiceData: any,
  ) {
    try {
      const result = await this.paymentService.createInvoiceWithProvider(
        provider,
        invoiceData,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response.data,
      };
    }
  }
  */
