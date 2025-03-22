import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { INDONESIA_POSTAL_CODE_FETCH } = envValues;

export const postalCodeConfig = registerAs('postalCode', () => ({
  indonesia: INDONESIA_POSTAL_CODE_FETCH,
}));
