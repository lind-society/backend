import { QUEUE } from '@libs/common/constants';
import { RabbitMqService } from '@libs/rabbitmq';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';

async function bootstrap() {
  const logger = new Logger('Mail - Bootstrap');

  const app = await NestFactory.create(MailModule);

  const rmqService = app.get<RabbitMqService>(RabbitMqService);

  app.connectMicroservice(rmqService.getOptions(QUEUE.MAIL));

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

  logger.log('Mail microservice is running...');
}
bootstrap();
