import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInvoiceRequest,
  Invoice,
  InvoiceFee,
  InvoiceItem,
} from 'xendit-node/invoice/models';
import { GetInvoicesRequest, InvoiceApi } from 'xendit-node/invoice/apis';

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

  private _calculateAmount(price: number, quantity: number): number {
    return price * quantity;
  }

  private _calculateFeeAmount(baseAmount: number, fee: number): number {
    return baseAmount * (fee / 100);
  }

  private _sanitizeCreateInvoicePayload(
    payload: CreateInvoiceRequest,
  ): CreateInvoiceRequest {
    const sanitizedInvoicePayload = { ...payload };

    if (
      sanitizedInvoicePayload.amount == null ||
      isNaN(sanitizedInvoicePayload.amount)
    ) {
      sanitizedInvoicePayload.amount = 0;
    }

    sanitizedInvoicePayload.externalId = `lind-${crypto.randomUUID()}`;

    if (
      sanitizedInvoicePayload.items &&
      sanitizedInvoicePayload.items.length > 0
    ) {
      for (const item of sanitizedInvoicePayload.items) {
        sanitizedInvoicePayload.amount += this._calculateAmount(
          item.price,
          item.quantity,
        );
      }
    }

    const baseAmount = sanitizedInvoicePayload.amount;

    if (
      sanitizedInvoicePayload.fees &&
      sanitizedInvoicePayload.fees.length > 0
    ) {
      for (const fee of sanitizedInvoicePayload.fees) {
        const feeAmount = this._calculateFeeAmount(baseAmount, fee.value);

        sanitizedInvoicePayload.amount += feeAmount;
      }
    }

    return sanitizedInvoicePayload;
  }

  private _sanitizeGetInvoicesPayload(
    payload: GetInvoicesRequest,
  ): GetInvoicesRequest {
    const sanitizedInvoicePayload = { ...payload };

    if (sanitizedInvoicePayload.createdBefore) {
      sanitizedInvoicePayload.createdBefore = new Date(
        sanitizedInvoicePayload.createdBefore,
      );
    }

    if (sanitizedInvoicePayload.createdAfter) {
      sanitizedInvoicePayload.createdAfter = new Date(
        sanitizedInvoicePayload.createdAfter,
      );
    }

    if (sanitizedInvoicePayload.paidBefore) {
      sanitizedInvoicePayload.paidBefore = new Date(
        sanitizedInvoicePayload.paidBefore,
      );
    }

    if (sanitizedInvoicePayload.paidAfter) {
      sanitizedInvoicePayload.paidAfter = new Date(
        sanitizedInvoicePayload.paidAfter,
      );
    }

    if (sanitizedInvoicePayload.expiredBefore) {
      sanitizedInvoicePayload.expiredBefore = new Date(
        sanitizedInvoicePayload.expiredBefore,
      );
    }

    if (sanitizedInvoicePayload.expiredAfter) {
      sanitizedInvoicePayload.expiredAfter = new Date(
        sanitizedInvoicePayload.expiredAfter,
      );
    }

    return sanitizedInvoicePayload;
  }

  async createInvoice(payload: CreateInvoiceRequest): Promise<string> {
    const sanitizedInvoicePayload = this._sanitizeCreateInvoicePayload(payload);

    console.log(payload);
    console.log(sanitizedInvoicePayload);

    const invoice = await this.invoiceClient.createInvoice({
      data: sanitizedInvoicePayload,
    });

    return invoice.invoiceUrl;
  }

  async getInvoices(payload: GetInvoicesRequest): Promise<Invoice[]> {
    const sanitizedGetInvoicesPayload =
      this._sanitizeGetInvoicesPayload(payload);

    const invoices = await this.invoiceClient.getInvoices(
      sanitizedGetInvoicesPayload,
    );

    return invoices;
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceClient.getInvoiceById({
      invoiceId,
    });

    return invoice;
  }

  async expireInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceClient.expireInvoice({
      invoiceId,
    });

    return invoice;
  }
}
