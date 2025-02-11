import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { XenditPaymentMethodClientProvider } from './payment-method-client.provider';
import { XenditCustomerClientProvider } from './customer-client.provider copy';
import { XenditClientProvider } from '../payment-client.provider';

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
