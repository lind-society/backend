import { QUEUE } from '@libs/common/constants';
import { RabbitMqService } from '@libs/rabbitmq';
import { MessageHandlerService } from '@libs/rabbitmq/services/message-handler.service';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as amqp from 'amqplib';
import { WhatsappModule } from './whatsapp.module';

async function bootstrap() {
  const logger = new Logger('Whatsapp - Bootstrap');

  const app = await NestFactory.create(WhatsappModule);

  const rmqService = app.get<RabbitMqService>(RabbitMqService);
  const messageHandlerService = app.get<MessageHandlerService>(
    MessageHandlerService,
  );

  // Connect to RabbitMQ and set up dead letter queues
  try {
    const connection = await amqp.connect(rmqService.getUrl());
    const channel = await connection.createChannel();

    // Setup dead letter queues
    await rmqService.setupDeadLetterQueue(channel, QUEUE.WHATSAPP);

    // Close the setup connection
    await channel.close();
    await connection.close();

    logger.log('Dead letter queues configured successfully');
  } catch (error) {
    logger.error(`Failed to configure dead letter queues: ${error.message}`);
  }

  app.connectMicroservice(rmqService.getOptions(QUEUE.WHATSAPP, true));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        logger.error(errors);

        return new UnprocessableEntityException(errors);
      },
    }),
  );

  await app.init();
  await app.startAllMicroservices();

  logger.log('WhatsApp microservice is running...');
}
bootstrap();
