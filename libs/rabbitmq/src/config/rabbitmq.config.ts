import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { RABBIT_MQ_URL, RABBIT_MQ_WHATSAPP_QUEUE } = envValues;

export const rabbitMqConfig = registerAs('rabbitMq', () => ({
  url: RABBIT_MQ_URL,
  queue: {
    whatsapp: RABBIT_MQ_WHATSAPP_QUEUE,
  },
}));
