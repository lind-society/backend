import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { FE_DEVELOPMENT, FE_STAGING, FE_PRODUCTION, FE_ADMIN } = envValues;

export const frontEndConfig = registerAs('frontend', () => ({
  development: FE_DEVELOPMENT,
  staging: FE_STAGING,
  production: FE_PRODUCTION,
  /**
   * The admin dashboard. Whitelisted for CORS only — it is a separate app from
   * the guest site, and guest-facing links must never be built from it.
   */
  admin: FE_ADMIN,
}));
