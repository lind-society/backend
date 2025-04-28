import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { XenditPaymentMethodClientProvider } from '../providers/xendit-payment-method-client.provider';
import { XenditCustomerClientProvider } from '../providers/xendit-customer-client.provider copy';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { CustomerModule } from '../customer/customer.module';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [CustomerModule],
  controllers: [PaymentMethodController],
  providers: [
    XenditClientProvider,
    XenditPaymentMethodClientProvider,
    XenditCustomerClientProvider,
    CustomerService,
    PaymentMethodService,
  ],
})
export class PaymentMethodModule {}
