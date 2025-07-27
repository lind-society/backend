import { SkipHal } from '@apps/main/common/decorators';
import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePaymentSessionDto, CreateSimulatePaymentDto } from './dto';
import { PaymentService } from './payment.service';
import { XenditPaymentRequestCallbackDto } from './strategies/xendit/dto';

@SkipHal()
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('payment/:paymentRequestId')
  async getPaymetRequestDetail(
    @Param('paymentRequestId') paymentRequestId: string,
  ) {
    const result =
      await this.paymentService.getPaymentRequestDetail(paymentRequestId);

    return result;
  }

  @Post('payment/:paymentRequestId/cancel')
  async cancelPaymetRequest(
    @Param('paymentRequestId') paymentRequestId: string,
  ) {
    const result =
      await this.paymentService.cancelPaymentRequest(paymentRequestId);

    return result;
  }

  @Post('payment/:paymentRequestId/simulate')
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

  @Post('payments/invoice/callback')
  async invoiceCallback(@Body() payload: any) {
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

  @Post('payment/callback/payment-request')
  async paymentRequestCallback(
    @Body() payload: XenditPaymentRequestCallbackDto,
  ) {
    await this.paymentService.receivePaymentRequestCallback(payload);
    // console.dir(payload, { depth: null, colors: true });
  }

  @Post('payment/session')
  async createPaymentSession(@Body() payload: CreatePaymentSessionDto) {
    const result = await this.paymentService.createPaymentSession(payload);
    return {
      success: true,
      data: result,
    };
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
}
