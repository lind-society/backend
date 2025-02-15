import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditInvoiceClientProvider: Provider = {
  provide: 'XENDIT_INVOICE_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Invoice;
  },
  inject: ['XENDIT_CLIENT'],
};
