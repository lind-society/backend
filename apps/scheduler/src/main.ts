import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SchedulerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'scheduler_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  const logger = new Logger('Scheduler - Bootstrap');

  await app.listen();
  logger.log('Scheduler microservice is running...');
}
bootstrap();
