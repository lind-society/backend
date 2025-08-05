import { Environment } from '@libs/common/enums';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  WHATSAPP_MAIN_CLIENT_ID: process.env.WHATSAPP_MAIN_CLIENT_ID || '',
  WHATSAPP_AUTH_STRATEGY: process.env.WHATSAPP_AUTH_STRATEGY || '',
  WHATSAPP_SESSION_PATH: process.env.WHATSAPP_SESSION_PATH || '',
  WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU:
    process.env.WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU || '',
  WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS:
    process.env.WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS || '',
};
