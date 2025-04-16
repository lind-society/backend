import { RabbitMqModule } from '@libs/rabbitmq/rabbitmq.module';
import { RabbitMqService } from '@libs/rabbitmq/rabbitmq.service';
import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule } from '@nestjs/microservices';
import { WHATSAPP_SERVICE } from './message-pattern';
import { WhatsappClientService } from './whatsapp-client.service';

@Module({
  imports: [ClientsModule, RabbitMqModule],
  providers: [
    {
      provide: WHATSAPP_SERVICE,
      useFactory: async (rabbitMqService: RabbitMqService) => {
        const options = rabbitMqService.getOptions('whatsapp');
        return ClientProxyFactory.create(options);
      },
      inject: [RabbitMqService],
    },
    WhatsappClientService,
  ],
  exports: [WhatsappClientService],
})
export class WhatsappClientModule {}
