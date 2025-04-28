import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditPayoutClientProvider: Provider = {
  provide: 'XENDIT_PAYOUT_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Payout;
  },
  inject: ['XENDIT_CLIENT'],
};
