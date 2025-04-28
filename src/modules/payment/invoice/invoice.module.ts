import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { XenditInvoiceClientProvider } from '../providers/xendit-invoice-client.provider';
import { XenditClientProvider } from '../providers/xendit-client.provider';
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
