import Xendit from 'xendit-node';
import { Inject, Injectable } from '@nestjs/common';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models';

@Injectable()
export class InvoiceService {
  constructor(@Inject('XENDIT_CLIENT') private readonly xenditClient: Xendit) {}

  async createPayment(payload: CreateInvoiceRequest): Promise<string> {
    const { Invoice } = this.xenditClient;

    try {
      const externalId = crypto.randomUUID();
      // const product
      const paymentData: CreateInvoiceRequest = {
        payerEmail: 'samueldjodi77@gmail.com',
        shouldSendEmail: true,
        amount: payload.amount,
        invoiceDuration: payload.description,
        externalId,
        description: `Invoice of ${externalId}`,
        currency: payload.currency,
        reminderTime: payload.reminderTime,
        items: [
          {
            name: 'villa-01',
            price: 100000,
            quantity: 1,
            referenceId: 'unique-id-1',
            url: 'villa-url',
            category: 'small-villa',
          },
        ],
        fees: [
          {
            type: 'pajak',
            value: 250,
          },
        ],
      };

      const response = await Invoice.createInvoice({
        data: paymentData,
      });

      return response.invoiceUrl;
    } catch (error) {}
  }
}
