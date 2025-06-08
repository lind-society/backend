import { Module } from '@nestjs/common';
import { QueueManagementController } from './queue-management.controller';
import { QueueManagementService } from './queue-management.service';

@Module({
  imports: [],
  controllers: [QueueManagementController],
  providers: [QueueManagementService],
})
export class QueueManagementModule {}
