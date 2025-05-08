import { Controller, Get, Logger, Post } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { MessageQueueService } from './message-queue.service';

@Controller('message-queue')
export class MessageQueueController {
  private readonly logger = new Logger(MessageQueueController.name);

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @Post('retry')
  async retryFailedMessages() {
    this.logger.log('Manual retry of failed messages requested');
    await this.messageQueueService.retryFailedMessages();
    return { success: true, message: 'Retry process initiated' };
  }

  @Get('stats')
  async getQueueStats() {
    return await this.messageQueueService.getQueueStats();
  }

  @Get('health-check')
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
