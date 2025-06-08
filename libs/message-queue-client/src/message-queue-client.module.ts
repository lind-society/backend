import { QUEUE, SERVICE } from '@libs/common/constants';
import { MessageQueue } from '@libs/common/entities';
import { RabbitMqModule } from '@libs/rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageQueueClientService } from './message-queue-client.service';

@Module({
  providers: [MessageQueueClientService],
  exports: [MessageQueueClientService],
  imports: [
    TypeOrmModule.forFeature([MessageQueue]),
    RabbitMqModule.register(SERVICE.WHATSAPP, QUEUE.MESSAGE_QUEUE),
  ],
})
export class MessageQueueClientModule {}
