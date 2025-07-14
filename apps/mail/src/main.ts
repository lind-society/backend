import { MAIL_QUEUE } from '@libs/common/constants';
import {
  getClientConfig,
  setupDeadLetterQueue,
  setupRetryQueue,
} from '@libs/rabbitmq/services';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MailModule } from './mail.module';

async function bootstrap() {
  await setupDeadLetterQueue(process.env.RABBITMQ_URL, MAIL_QUEUE);
  await setupRetryQueue(process.env.RABBITMQ_URL, MAIL_QUEUE);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(MailModule, {
      ...getClientConfig(process.env.RABBITMQ_URL, MAIL_QUEUE),
    });

  const logger = new Logger('Mail - Bootstrap');

  microservice.useGlobalPipes(
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

  await microservice.listen();
  logger.log('Mail microservice is running...');
  logger.log(`Mail microservice listening to queue : ${MAIL_QUEUE}`);
}
bootstrap();
