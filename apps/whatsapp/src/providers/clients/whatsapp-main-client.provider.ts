import { Environment, WhatsappClientProviders } from '@libs/common/enums';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';

export const MainWhatsappClientProvider = {
  provide: WhatsappClientProviders.Main,
  useFactory: (configService: ConfigService) => {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: configService.get<string>('whatsapp.client.main.id'),
        dataPath: configService.get<string>('whatsapp.config.sessionPath'),
      }),
      puppeteer: {
        headless: true,
        executablePath:
          configService.get<string>('app.env') === Environment.Development
            ? configService.get<string>('whatsapp.config.browserPathWindows')
            : configService.get<string>('whatsapp.config.browserPathUbuntu'),
      },
    });
    return client;
  },
  inject: [ConfigService],
};
