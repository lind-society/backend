import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { WHATSAPP_AUTH_STRATEGY, WHATSAPP_MAIN_CLIENT_ID } = envValues;

export const whatsappConfig = registerAs('whatsapp', () => ({
  auth: {
    strategy: WHATSAPP_AUTH_STRATEGY,
  },
  client: {
    main: {
      id: WHATSAPP_MAIN_CLIENT_ID,
    },
  },
}));
