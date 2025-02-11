import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { XenditInvoiceClientProvider } from './invoice-client.provider';
import { XenditClientProvider } from '../payment-client.provider';
import { InvoiceController } from './invoice.controller';

@Module({
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    XenditClientProvider,
    XenditInvoiceClientProvider,
  ],
})
export class InvoiceModule {}
