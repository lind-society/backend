import { Environment, WhatsappClientProviders } from '@libs/common/enums';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';

export const MainWhatsappClientProvider = {
  provide: WhatsappClientProviders.Main,
  useFactory: (configService: ConfigService) => {
    const isDev =
      configService.get<string>('app.env') === Environment.Development;

    const webVersionRemotePath = configService.get<string>(
      'whatsapp.config.webVersionRemotePath',
    );

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: configService.get<string>('whatsapp.client.main.id'),
        dataPath: configService.get<string>('whatsapp.config.sessionPath'),
      }),
      /**
       * Pin the WhatsApp Web build the library runs against.
       *
       * Unpinned, the client loads whatever WhatsApp serves that day. When Meta
       * changes the page internals, whatsapp-web.js can no longer find the
       * modules it injects against and simply never emits `ready` — no error,
       * no QR, no messages sent, and nothing in the logs to say why. Pinning
       * trades "silently broken one morning" for "bump a version deliberately".
       */
      ...(webVersionRemotePath
        ? {
            webVersionCache: {
              type: 'remote' as const,
              remotePath: webVersionRemotePath,
            },
          }
        : {}),
      puppeteer: {
        headless: true,
        executablePath: isDev
          ? configService.get<string>('whatsapp.config.browserPathWindows')
          : configService.get<string>('whatsapp.config.browserPathUbuntu'),
        ...(!isDev && {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        }),
      },
    });
    return client;
  },
  inject: [ConfigService],
};
