import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { RABBITMQ_URL } = envValues;

export const rabbitMqConfig = registerAs('rabbitMq', () => ({
  url: RABBITMQ_URL,
}));
