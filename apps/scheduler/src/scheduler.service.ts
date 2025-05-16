import { DAILY_UPDATE_PRICE_RULE } from '@libs/common/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { SCHEDULER_SERVICE } from './message-pattern';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @Inject(SCHEDULER_SERVICE)
    private readonly client: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  @Cron('* * * * *')
  async dailyPriceUpdate() {
    this.logger.log('Running daily price updates');

    try {
      // Using emit for EventPattern (pub/sub)
      this.client.emit(DAILY_UPDATE_PRICE_RULE, {
        timestamp: new Date().toISOString(),
        source: 'scheduler',
      });

      this.logger.log('Price update event emitted');
    } catch (error) {
      this.logger.error(
        `Error emitting price update event: ${error.message}`,
        error.stack,
      );
    }
  }
}
