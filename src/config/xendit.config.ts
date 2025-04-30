import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { XENDIT_SECRET_KEY } = envValues;

export const xenditConfig = registerAs('xendit', () => ({
  secretKey: XENDIT_SECRET_KEY,
}));
