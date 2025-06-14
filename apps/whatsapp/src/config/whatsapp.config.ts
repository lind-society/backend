import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  WHATSAPP_AUTH_STRATEGY,
  WHATSAPP_MAIN_CLIENT_ID,
  WHATSAPP_SESSION_PATH,
  WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU,
  WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS,
} = envValues;

export const whatsappConfig = registerAs('whatsapp', () => ({
  auth: {
    strategy: WHATSAPP_AUTH_STRATEGY,
  },
  client: {
    main: {
      id: WHATSAPP_MAIN_CLIENT_ID,
    },
  },
  config: {
    sessionPath: WHATSAPP_SESSION_PATH,
    browserPathUbuntu: WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU,
    browserPathWindows: WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS,
  },
}));
