import { WHATSAPP_QUEUE } from '@libs/common/constants';
import { getClientConfig } from '@libs/rabbitmq/services';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { WHATSAPP_SERVICE } from './constant';
import { WhatsappClientService } from './whatsapp-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WHATSAPP_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>('RABBITMQ_URL');
          return getClientConfig(rmqUrl, WHATSAPP_QUEUE);
        },
      },
    ]),
  ],
  providers: [WhatsappClientService],
  exports: [WhatsappClientService],
})
export class WhatsappClientModule {}
