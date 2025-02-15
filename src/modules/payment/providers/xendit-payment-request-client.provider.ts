import { Provider } from '@nestjs/common';
import { Xendit } from 'xendit-node';

export const XenditPaymentRequestClientProvider: Provider = {
  provide: 'XENDIT_PAYMENT_REQUEST_CLIENT',
  useFactory: (xenditClient: Xendit) => {
    return xenditClient.PaymentRequest;
  },
  inject: ['XENDIT_CLIENT'],
};
