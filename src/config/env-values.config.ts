import { Environment, StorageProvider } from 'src/common/enums';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  API_VERSION: process.env.API_VERSION || 'v1',
  HOST: process.env.HOST || '',
  PORT: parseInt(process.env.PORT || '3000', 10) || 3000,
  XENDIT_SECRET_KEY: process.env.XENDIT_SECRET_KEY || '',
  DB_TYPE: process.env.DB_TYPE || '',
  DB_PORT: process.env.DB_PORT || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  STORAGE_PROVIDER:
    (process.env.STORAGE_PROVIDER as StorageProvider) || StorageProvider.GCP,
  GCP_BUCKET_NAME: process.env.GCP_BUCKET_NAME || '',
  GCP_KEY_FILE_PATH: process.env.GCP_KEY_FILE_PATH || '',
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || '',
  JWT_AT_SECRET: process.env.JWT_AT_SECRET || '',
  JWT_RT_SECRET: process.env.JWT_RT_SECRET || '',
  JWT_AT_EXPIRE: process.env.JWT_AT_EXPIRE || '',
  JWT_RT_EXPIRE: process.env.JWT_RT_EXPIRE || '',
};
