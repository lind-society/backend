import { InvoiceCardsInstallmentConfigurationAllowedTermsInner } from './invoice-card-installment-configuration-allowed-terms-inner.dto';

export class InvoiceCardInstallmentConfiguration {
  allowFullPayment: boolean;
  allowedTerms: InvoiceCardsInstallmentConfigurationAllowedTermsInner[];
}
