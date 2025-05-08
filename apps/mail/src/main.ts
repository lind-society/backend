import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailModule } from './mail.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'mail_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  const logger = new Logger('Mail - Bootstrap');

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

  await app.listen();
  logger.log('Mail microservice is running...');
}
bootstrap();
