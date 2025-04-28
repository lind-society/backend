import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models';
import { GetInvoicesRequest } from 'xendit-node/invoice/apis';

@Controller('payment/invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Body() payload: CreateInvoiceRequest) {
    try {
      const result = await this.invoiceService.createInvoice(payload);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get('')
  async getInvoices(@Body() payload: GetInvoicesRequest) {
    try {
      const result = await this.invoiceService.getInvoices(payload);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getInvoiceById(@Param('id') invoiceId: string) {
    try {
      const result = await this.invoiceService.getInvoiceById(invoiceId);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Post(':id/expire')
  async expireInvoice(@Param('id') invoiceId: string) {
    try {
      const result = await this.invoiceService.expireInvoice(invoiceId);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
