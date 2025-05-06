import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailClientService } from './mail-client.service';
import { MAIL_SERVICE } from './message-pattern';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MAIL_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'mail_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [MailClientService],
  exports: [MailClientService],
})
export class MailClientModule {}
