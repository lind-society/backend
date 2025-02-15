import { CardInstallmentConfiguration } from 'xendit-node/payment_method/models';

export class InvoiceCardProperty {
  allowedBins?: Array<string>;
  installmentConfiguration?: CardInstallmentConfiguration;
}
