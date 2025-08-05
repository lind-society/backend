import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { LINDWAY_CLIENT, LIND_SOCIETY_CLIENT } = envValues;

export const clientWhitelistConfig = registerAs('client_whitelist', () => ({
  lindway: LINDWAY_CLIENT,
  lind_society: LIND_SOCIETY_CLIENT,
}));
