import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { STORAGE_PROVIDER } = envValues;

export const storageConfig = registerAs('storage', () => ({
  provider: STORAGE_PROVIDER,
}));
