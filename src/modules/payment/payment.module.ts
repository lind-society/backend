import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { XenditClientProvider } from './providers/xendit-client.provider';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentRequestModule } from './payment-request/payment-request.module';
import { BalanceModule } from './balance/balance.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, XenditClientProvider],
  exports: [PaymentService, XenditClientProvider],
  imports: [InvoiceModule, PaymentMethodModule, PaymentRequestModule, BalanceModule],
})
export class PaymentModule {}
