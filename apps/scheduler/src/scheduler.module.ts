import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { SCHEDULER_SERVICE } from './message-pattern';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SCHEDULER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'scheduler_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
