import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { BASE_CURRENCY_CODE } = envValues;

export const currencyConfig = registerAs('currency', () => ({
  base: {
    code: BASE_CURRENCY_CODE,
  },
}));
