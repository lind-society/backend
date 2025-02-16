import { Environment } from 'src/common/enums/environment.enum';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  API_VERSION: process.env.API_VERSION || 'v1',
  HOST: process.env.HOST || '',
  PORT: parseInt(process.env.PORT || '3000', 10),
  XENDIT_SECRET_KEY: process.env.XENDIT_SECRET_KEY || '',
  DB_TYPE: process.env.DB_TYPE || '',
  DB_PORT: process.env.DB_PORT || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
};
