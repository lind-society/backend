import { envPaths } from '@libs/common/constants';
import { RabbitMqModule } from '@libs/rabbitmq';
import { MessageHandlerService } from '@libs/rabbitmq/services/message-handler.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv, whatsappConfig } from './config';
import { appConfig } from './config/app.config';
import { MainWhatsappClientProvider } from './providers/clients';
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
    RabbitMqModule,
  ],
  controllers: [WhatsappServiceController],
  providers: [
    WhatsappService,
    WhatsAppClientFactory,
    MainWhatsappClientProvider,
    MessageHandlerService,
  ],
  exports: [WhatsappService],
})
export class WhatsappModule {}
