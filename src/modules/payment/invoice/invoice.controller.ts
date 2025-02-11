import { Controller, Post, Body } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models';

@Controller('/payment/invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('')
  async createPayment(@Body() payload: CreateInvoiceRequest) {
    const result = await this.invoiceService.createPayment(payload);

    return result;
  }
}
