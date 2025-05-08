import { Environment } from '@libs/common/enums';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  DB_TYPE: process.env.DB_TYPE || '',
  DB_PORT: process.env.DB_PORT || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
};
