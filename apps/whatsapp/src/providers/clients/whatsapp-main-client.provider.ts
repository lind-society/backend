import { Environment, WhatsappClientProviders } from '@libs/common/enums';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';

export const MainWhatsappClientProvider = {
  provide: WhatsappClientProviders.Main,
  useFactory: (configService: ConfigService) => {
    const isDev =
      configService.get<string>('app.env') === Environment.Development;

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: configService.get<string>('whatsapp.client.main.id'),
        dataPath: configService.get<string>('whatsapp.config.sessionPath'),
      }),
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
