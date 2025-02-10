import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Invoice as InvoiceClient } from 'xendit-node';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';

@Injectable()
export class PaymentService implements OnModuleInit {
  private xenditClient: InvoiceClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.xenditClient = new InvoiceClient({
      secretKey: this.configService.get('xendit.secret_key'),
    });
  }

  async createPayment(amount: string): Promise<string> {
    const externalId = crypto.randomUUID();
    const paymentData: CreatePaymentDto = {
      amount: parseInt(amount, 10),
      invoiceDuration: '172800',
      externalId,
      description: `Invoice of ${externalId}`,
      currency: 'IDR',
      reminderTime: 1,
    };
    try {
      const response = await this.xenditClient.createInvoice({
        data: paymentData,
      });

      return response.invoiceUrl;
    } catch (error) {
      throw error;
    }
  }

  async paymentCallback(
    callbackResponse: PaymentCallbackDto | unknown,
  ): Promise<PaymentCallbackDto | unknown> {
    console.log('callback response :\n', callbackResponse);

    return callbackResponse;
  }
}
