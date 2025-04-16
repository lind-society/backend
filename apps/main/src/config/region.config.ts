import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  GEONAMES_API_USERNAME,
  GLOBAL_REGION_FETCH,
  INDONESIA_REGION_FETCH,
  COUNTRY_PHONE_CODE_JSON_PATH,
} = envValues;

export const regionConfig = registerAs('region', () => ({
  phoneCode: COUNTRY_PHONE_CODE_JSON_PATH,
  geonames: {
    username: GEONAMES_API_USERNAME,
  },
  global: GLOBAL_REGION_FETCH,
  indonesia: INDONESIA_REGION_FETCH,
}));
