import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { FE_DEVELOPMENT, FE_STAGING, FE_PRODUCTION } = envValues;

export const frontEndConfig = registerAs('frontend', () => ({
  development: FE_DEVELOPMENT,
  staging: FE_STAGING,
  production: FE_PRODUCTION,
}));
