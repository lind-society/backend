import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  PAYMENT_GATEWAY_PROVIDER_NAME,
  PAYMENT_GATEWAY_PROVIDER_URL,
  XENDIT_API_VERSION,
  XENDIT_WEBHOOK_VERIFICATION_TOKEN,
  XENDIT_USERNAME,
} = envValues;

export const paymentConfig = registerAs('payment', () => ({
  gateway: {
    provider: {
      name: PAYMENT_GATEWAY_PROVIDER_NAME,
      baseUrl: PAYMENT_GATEWAY_PROVIDER_URL,
      xendit: {
        apiVersion: XENDIT_API_VERSION,
        webhookVerificationToken: XENDIT_WEBHOOK_VERIFICATION_TOKEN,
        config: {
          username: XENDIT_USERNAME,
        },
      },
    },
  },
}));
