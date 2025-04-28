import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { XenditClientProvider } from './providers/xendit-client.provider';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentRequestModule } from './payment-request/payment-request.module';
import { BalanceModule } from './balance/balance.module';
import { CustomerModule } from './customer/customer.module';
import { TransactionModule } from './transaction/transaction.module';
import { RefundModule } from './refund/refund.module';
import { PayoutModule } from './payout/payout.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, XenditClientProvider],
  exports: [PaymentService, XenditClientProvider],
  imports: [
    InvoiceModule,
    PaymentMethodModule,
    PaymentRequestModule,
    BalanceModule,
    CustomerModule,
    TransactionModule,
    RefundModule,
    PayoutModule,
  ],
})
export class PaymentModule {}
