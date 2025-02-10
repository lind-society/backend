import { Environment } from 'src/common/enums/environment.enum';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  HOST: process.env.HOST || '',
  PORT: parseInt(process.env.PORT || '3000', 10),
  XENDIT_SECRET_KEY: process.env.XENDIT_SECRET_KEY || '',
};
