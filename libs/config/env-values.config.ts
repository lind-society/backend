import { envConfig, LibEnvironmentVariables } from './env.config';

envConfig();

export const envValues: LibEnvironmentVariables = {
  RABBITMQ_URL: process.env.RABBITMQ_URL || '',
};
