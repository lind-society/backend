import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { NODE_ENV, PORT, HOST } = envValues;

export const appConfig = registerAs('app', () => ({
  env: NODE_ENV,
  port: PORT,
  host: HOST,
}));
