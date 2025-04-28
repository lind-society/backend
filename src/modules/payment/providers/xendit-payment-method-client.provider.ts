import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditPaymentMethodClientProvider: Provider = {
  provide: 'XENDIT_PAYMENT_METHOD_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.PaymentMethod;
  },
  inject: ['XENDIT_CLIENT'],
};
