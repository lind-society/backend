import { QUEUE, SERVICE } from '@libs/common/constants';
import { RabbitMqModule } from '@libs/rabbitmq';
import { Module } from '@nestjs/common';
import { MailClientService } from './mail-client.service';

@Module({
  imports: [RabbitMqModule.register(SERVICE.MAIL, QUEUE.MAIL)],
  providers: [MailClientService],
  exports: [MailClientService],
})
export class MailClientModule {}
