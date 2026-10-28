import { envPaths, WHATSAPP_INBOUND_QUEUE } from '@libs/common/constants';
import { getClientConfig } from '@libs/rabbitmq/services';
import { WHATSAPP_INBOUND_SERVICE } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { validateEnv, whatsappConfig } from './config';
import { appConfig } from './config/app.config';
import { MainWhatsappClientProvider } from './providers/clients';
import { WhatsappInboundService } from './whatsapp-inbound.service';
import { WhatsappServiceController } from './whatsapp.controller';
import { WhatsAppClientFactory } from './whatsapp.factory';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths[process.env.NODE_ENV || 'development'],
      validate: validateEnv,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      load: [appConfig, whatsappConfig],
    }),
    // Producer side of the inbound queue. The microservice itself listens on
    // WHATSAPP_QUEUE; this client only publishes onto the return channel.
    ClientsModule.registerAsync([
      {
        name: WHATSAPP_INBOUND_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          getClientConfig(
            configService.get<string>('RABBITMQ_URL'),
            WHATSAPP_INBOUND_QUEUE,
          ),
      },
    ]),
  ],
  controllers: [WhatsappServiceController],
  providers: [
    WhatsappService,
    WhatsappInboundService,
    WhatsAppClientFactory,
    MainWhatsappClientProvider,
  ],
})
export class WhatsappModule {}
