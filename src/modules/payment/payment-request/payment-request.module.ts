import { Module } from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { PaymentRequestController } from './payment-request.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditPaymentRequestClientProvider } from '../providers/xendit-payment-request-client.provider';

@Module({
  controllers: [PaymentRequestController],
  providers: [
    XenditClientProvider,
    XenditPaymentRequestClientProvider,
    PaymentRequestService,
  ],
})
export class PaymentRequestModule {}
