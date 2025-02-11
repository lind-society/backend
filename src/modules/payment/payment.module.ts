import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { XenditClientProvider } from './payment-client.provider';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService , XenditClientProvider],
  exports: [PaymentService , XenditClientProvider],
  imports: [InvoiceModule],
})
export class PaymentModule {}
