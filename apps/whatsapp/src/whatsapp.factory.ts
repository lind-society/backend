import { WhatsappAuthStrategy } from '@apps/main/common/enums';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'whatsapp-web.js';
import { WhatsappClientProvider } from './providers/whatsapp-client.provider';

export const WhatsAppClientFactory: Provider = {
  provide: 'WHATSAPP_PROVIDER',
  useFactory: (configService: ConfigService, client: Client) => {
    const authProvider = configService.get<string>('whatsapp.auth.strategy');

    switch (authProvider) {
      case WhatsappAuthStrategy.Local:
        return new WhatsappClientProvider(client);

      case WhatsappAuthStrategy.Remote:
        throw new InternalServerErrorException(
          'Invalid WhatsApp Auth Provider',
        );

      default:
        throw new InternalServerErrorException(
          'Invalid WhatsApp Auth Provider',
        );
    }
  },
  inject: [ConfigService, 'MAIN_WHATSAPP_CLIENT'],
};
