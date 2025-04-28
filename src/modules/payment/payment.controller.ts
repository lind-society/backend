import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/callback')
  async paymentCallback(@Body() body: any) {
    try {
      const result = await this.paymentService.paymentCallback(body);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
