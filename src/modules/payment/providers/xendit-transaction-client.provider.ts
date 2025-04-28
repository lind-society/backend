import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditTransactionClientProvider: Provider = {
  provide: 'XENDIT_TRANSACTION_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Transaction;
  },
  inject: ['XENDIT_CLIENT'],
};
