import { Controller, Get } from '@nestjs/common';
import { QueueManagementService } from './queue-management.service';

@Controller()
export class QueueManagementController {
  constructor(private readonly queueManagementService: QueueManagementService) {}

  @Get()
  getHello(): string {
    return this.queueManagementService.getHello();
  }
}
