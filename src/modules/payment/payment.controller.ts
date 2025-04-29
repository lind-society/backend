import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/callback/invoice')
  async paymentInvoiceCallback(@Body() body: any) {
    try {
      const result = await this.paymentService.paymentInvoiceCallback(body);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post('/callback/payment-request')
  async paymentRequestCallback(@Body() body: any) {
    try {
      const result = await this.paymentService.paymentRequestCallback(body);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post('/callback/payment-method')
  async paymentMethodCallback(@Body() body: any) {
    try {
      const result = await this.paymentService.paymentMethodCallback(body);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
