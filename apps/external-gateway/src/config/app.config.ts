import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { API_VERSION, HOST, NODE_ENV, EXTERNAL_GATEWAY_PORT } = envValues;

export const appConfig = registerAs('app', () => ({
  env: NODE_ENV,
  port: EXTERNAL_GATEWAY_PORT,
  host: HOST,
  apiVersion: API_VERSION,
}));
