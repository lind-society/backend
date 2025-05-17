import { envConfig } from '@libs/config';
import { EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  RABBIT_MQ_URL: process.env.RABBIT_MQ_URL || '',
  RABBIT_MQ_WHATSAPP_QUEUE: process.env.RABBIT_MQ_WHATSAPP_QUEUE || '',
};
