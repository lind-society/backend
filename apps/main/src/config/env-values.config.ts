import { StorageProvider } from '@apps/main/common/enums';
import { Environment } from '@libs/common/enums';
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
  FE_DEVELOPMENT: process.env.FE_DEVELOPMENT || '',
  FE_STAGING: process.env.FE_STAGING || '',
  FE_PRODUCTION: process.env.FE_DEVELOPMENT || '',
  STORAGE_PROVIDER:
    (process.env.STORAGE_PROVIDER as StorageProvider) || StorageProvider.GCP,
  GCP_BUCKET_NAME: process.env.GCP_BUCKET_NAME || '',
  GCP_KEY_FILE_PATH: process.env.GCP_KEY_FILE_PATH || '',
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || '',
  JWT_AT_SECRET: process.env.JWT_AT_SECRET || '',
  JWT_RT_SECRET: process.env.JWT_RT_SECRET || '',
  JWT_AT_EXPIRE: process.env.JWT_AT_EXPIRE || '',
  JWT_RT_EXPIRE: process.env.JWT_RT_EXPIRE || '',
  PHOTOS_LIMIT_QUANTITY:
    parseInt(process.env.PHOTOS_LIMIT_QUANTITY || '10', 10) || 10,
  PHOTOS_LIMIT_SIZE: parseInt(process.env.PHOTOS_LIMIT_SIZE || '2', 10) || 2,
  VIDEOS_LIMIT_QUANTITY:
    parseInt(process.env.VIDEOS_LIMIT_QUANTITY || '5', 10) || 5,
  VIDEOS_LIMIT_SIZE: parseInt(process.env.VIDEOS_LIMIT_SIZE || '20', 10) || 20,
  VIDEO_360S_LIMIT_QUANTITY:
    parseInt(process.env.VIDEO_360S_LIMIT_QUANTITY || '5', 10) || 5,
  VIDEO_360S_LIMIT_SIZE:
    parseInt(process.env.VIDEO_360S_LIMIT_SIZE || '30', 10) || 30,
  INDONESIA_REGION_FETCH: process.env.INDONESIA_REGION_FETCH || '',
  INDONESIA_POSTAL_CODE_FETCH: process.env.INDONESIA_POSTAL_CODE_FETCH || '',
  GLOBAL_REGION_FETCH: process.env.GLOBAL_REGION_FETCH || '',
  GLOBAL_POSTAL_CODE_FETCH: process.env.GLOBAL_POSTAL_CODE_FETCH || '',
  GEONAMES_API_USERNAME: process.env.GEONAMES_API_USERNAME || '',
  COUNTRY_PHONE_CODE_JSON_PATH: process.env.COUNTRY_PHONE_CODE_JSON_PATH || '',
  BASE_CURRENCY_CODE: process.env.BASE_CURRENCY_CODE || '',
  PAYMENT_GATEWAY_PROVIDER_NAME:
    process.env.PAYMENT_GATEWAY_PROVIDER_NAME || '',
  PAYMENT_GATEWAY_PROVIDER_URL: process.env.PAYMENT_GATEWAY_PROVIDER_URL || '',
  XENDIT_API_VERSION: process.env.XENDIT_API_VERSION || '',
  XENDIT_WEBHOOK_VERIFICATION_TOKEN:
    process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN || '',
  XENDIT_USERNAME: process.env.XENDIT_USERNAME || '',
};
