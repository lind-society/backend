import { Environment } from '@libs/common/enums/environment.enum';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  API_VERSION: process.env.API_VERSION || 'v1',
  HOST: process.env.HOST || '',
  EXTERNAL_GATEWAY_PORT: process.env.EXTERNAL_GATEWAY_PORT || '',
  LINDWAY_CLIENT: process.env.LINDWAY_CLIENT || '',
  LIND_SOCIETY_CLIENT: process.env.LIND_SOCIETY_CLIENT || '',
};
