import { MessageQueue } from '@libs/common/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageQueueClientService } from './message-queue-client.service';

@Module({
  providers: [MessageQueueClientService],
  exports: [MessageQueueClientService],
  imports: [TypeOrmModule.forFeature([MessageQueue])],
})
export class MessageQueueClientModule {}
