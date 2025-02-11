import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInvoiceRequest,
  InvoiceFee,
  InvoiceItem,
} from 'xendit-node/invoice/models';
import { InvoiceApi } from 'xendit-node/invoice/apis';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject('XENDIT_INVOICE_CLIENT') private readonly invoiceClient: InvoiceApi,
  ) {}

  /*
    Documentations
      - https://developers.xendit.co/api-reference/#create-invoice
      - https://github.com/xendit/xendit-node/blob/master/docs/Invoice.md
  **/
  async createPayment(payload: CreateInvoiceRequest): Promise<string> {
    try {
      const externalId = crypto.randomUUID();
      const product: InvoiceItem = {
        name: 'villa-01',
        price: 100000,
        quantity: 1,
        referenceId: 'unique-id-1',
        url: 'villa-url',
        category: 'small-villa',
      };

      const tax: InvoiceFee = {
        type: 'pajak',
        value: product.price * product.quantity * 0.1,
      };

      const paymentData: CreateInvoiceRequest = {
        payerEmail: 'samueldjodi77@gmail.com',
        shouldSendEmail: true,
        amount: product.price * product.quantity + tax.value,
        invoiceDuration: payload.description,
        externalId,
        description: `Invoice of ${externalId}`,
        currency: payload.currency,
        reminderTime: payload.reminderTime,
        items: [product],
        fees: [tax],
      };

      const response = await this.invoiceClient.createInvoice({
        data: paymentData,
      });

      return response.invoiceUrl;
    } catch (error) {}
  }
}
