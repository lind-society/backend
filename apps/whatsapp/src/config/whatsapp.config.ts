import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  CHROME_WS_ENDPOINT,
  WHATSAPP_AUTH_STRATEGY,
  WHATSAPP_MAIN_CLIENT_ID,
  WHATSAPP_SESSION_PATH,
  WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU,
  WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS,
  WHATSAPP_WEB_VERSION,
} = envValues;

/**
 * Snapshots of WhatsApp Web that whatsapp-web.js is known to work against.
 *
 * Without a pin the client loads whatever WhatsApp serves that day; when Meta
 * changes the page internals the library stops finding the modules it injects
 * against and hangs — no error, no `ready` event, no messages sent. That is
 * exactly how this broke, so the version is pinned and bumped deliberately.
 */
const WHATSAPP_WEB_VERSION_HOST =
  'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html';

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
    browserWebSocketEndpoint: CHROME_WS_ENDPOINT,
    sessionPath: WHATSAPP_SESSION_PATH,
    browserPathUbuntu: WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU,
    browserPathWindows: WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS,
    /** Empty means "whatever WhatsApp serves today" — deliberately unpinned. */
    webVersion: WHATSAPP_WEB_VERSION,
    webVersionRemotePath: WHATSAPP_WEB_VERSION
      ? `${WHATSAPP_WEB_VERSION_HOST}/${WHATSAPP_WEB_VERSION}.html`
      : null,
  },
}));
