import { MAIL_QUEUE } from '@libs/common/constants';
import { getClientConfig } from '@libs/rabbitmq/services';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MailClientService } from './mail-client.service';
import { MAIL_SERVICE } from './message-pattern';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MAIL_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>('RABBITMQ_URL');
          return getClientConfig(rmqUrl, MAIL_QUEUE);
        },
      },
    ]),
  ],
  providers: [MailClientService],
  exports: [MailClientService],
})
export class MailClientModule {}
