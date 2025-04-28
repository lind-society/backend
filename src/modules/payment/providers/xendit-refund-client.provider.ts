import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditRefundClientProvider: Provider = {
  provide: 'XENDIT_REFUND_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Refund;
  },
  inject: ['XENDIT_CLIENT'],
};
