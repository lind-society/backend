import { SkipHal } from '@apps/main/common/decorators';
import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@SkipHal()
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
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
  async paymentRequestCallback(@Body() payload: any) {
    try {
      console.log('callback payload received :', payload);
    } catch (error) {
      return {
        success: false,
        error: error.response.data,
      };
    }
  }

  @Post('bookings/:bookingId/payment/create-payments-session')
  async createPaymentSession(@Body() payload: any) {
    try {
      const result = await this.paymentService.createPaymentSession(payload);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);
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
}
