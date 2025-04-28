import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditCustomerClientProvider: Provider = {
  provide: 'XENDIT_CUSTOMER_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.Customer;
  },
  inject: ['XENDIT_CLIENT'],
};
