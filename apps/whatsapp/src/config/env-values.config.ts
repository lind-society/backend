import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  WHATSAPP_MAIN_CLIENT_ID: process.env.WHATSAPP_MAIN_CLIENT_ID || '',
  WHATSAPP_AUTH_STRATEGY: process.env.WHATSAPP_AUTH_STRATEGY || '',
};
