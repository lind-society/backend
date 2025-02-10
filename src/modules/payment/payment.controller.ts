import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('')
  async createPayment(@Body() payload: string) {
    const result = await this.paymentService.createPayment(payload);

    return result;
  }

  @Post('/callback')
  async paymentCallback(@Body() body: any) {
    const result = await this.paymentService.paymentCallback(body);

    return result;
  }
}
