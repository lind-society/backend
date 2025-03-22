import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { INDONESIA_REGION_FETCH } = envValues;

export const regionConfig = registerAs('region', () => ({
  indonesia: INDONESIA_REGION_FETCH,
}));
