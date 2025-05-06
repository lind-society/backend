import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  MAIL_HOST: process.env.MAIL_HOST || '',
  MAIL_PORT: process.env.MAIL_PORT || '',
  MAIL_SECURE: process.env.MAIL_SECURE || '',
  MAIL_USER: process.env.MAIL_USER || '',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
  MAIL_SENDER_EMAIL: process.env.MAIL_SENDER_EMAIL || '',
  MAIL_SENDER_NAME: process.env.MAIL_SENDER_NAME || '',
};
