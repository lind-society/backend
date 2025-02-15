import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { XenditPaymentMethodClientProvider } from '../providers/xendit-payment-method-client.provider';
import { XenditCustomerClientProvider } from '../providers/xendit-customer-client.provider copy';
import { XenditClientProvider } from '../providers/xendit-client.provider';

@Module({
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    XenditClientProvider,
    XenditPaymentMethodClientProvider,
    XenditCustomerClientProvider,
  ],
})
export class PaymentMethodModule {}
