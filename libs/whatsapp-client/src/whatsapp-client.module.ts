import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WHATSAPP_SERVICE } from './message-pattern';
import { WhatsappClientService } from './whatsapp-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WHATSAPP_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'whatsapp_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [WhatsappClientService],
  exports: [WhatsappClientService],
})
export class WhatsappClientModule {}
