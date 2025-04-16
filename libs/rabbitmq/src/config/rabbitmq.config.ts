import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { RABBIT_MQ_URI, RABBIT_MQ_WHATSAPP_QUEUE } = envValues;

export const rabbitMqConfig = registerAs('rabbitMq', () => ({
  uri: RABBIT_MQ_URI,
  queue: {
    whatsapp: RABBIT_MQ_WHATSAPP_QUEUE,
  },
}));
