import { ConfigService } from '@nestjs/config';
import * as qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';

export const MainWhatsappClientProvider = {
  provide: 'MAIN_WHATSAPP_CLIENT',
  useFactory: (configService: ConfigService) => {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: configService.get<string>('whatsapp.client.main.id'),
        dataPath: './whatsapp-session',
      }),
      puppeteer: { headless: true },
    });

    client.on('qr', (qr: string) => {
      console.log('QR RECEIVED :', qr);

      qrcode.generate(qr, { small: true }); // Render QR in terminal
    });

    client.on('ready', () => {
      console.log('WhatsApp Client is ready!');
    });

    return client;
  },
  inject: [ConfigService],
};
