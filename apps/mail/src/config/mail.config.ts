import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_SENDER_EMAIL,
  MAIL_SENDER_NAME,
} = envValues;

export const mailConfig = registerAs('mail', () => ({
  config: {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    user: MAIL_USER,
    password: MAIL_PASSWORD,
  },
  sender: {
    email: MAIL_SENDER_EMAIL,
    name: MAIL_SENDER_NAME,
  },
}));
