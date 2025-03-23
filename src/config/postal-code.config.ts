import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { GLOBAL_POSTAL_CODE_FETCH, INDONESIA_POSTAL_CODE_FETCH } = envValues;

export const postalCodeConfig = registerAs('postalCode', () => ({
  global: GLOBAL_POSTAL_CODE_FETCH,
  indonesia: INDONESIA_POSTAL_CODE_FETCH,
}));
