import { QUEUE } from '@libs/common/constants';
import { RabbitMqService } from '@libs/rabbitmq';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MessageQueueModule } from './message-queue.module';

async function bootstrap() {
  const logger = new Logger('Message Queue - Bootstrap');

  const app = await NestFactory.create(MessageQueueModule);

  const rmqService = app.get<RabbitMqService>(RabbitMqService);

  app.connectMicroservice(rmqService.getOptions(QUEUE.MESSAGE_QUEUE));

  await app.init();
  await app.startAllMicroservices();

  logger.log('Message Queue microservice is running...');
}
bootstrap();
