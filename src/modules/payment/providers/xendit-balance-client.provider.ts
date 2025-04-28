import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditBalanceClientProvider: Provider = {
  provide: 'XENDIT_BALANCE_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Balance;
  },
  inject: ['XENDIT_CLIENT'],
};
