import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WhatsappModule } from './whatsapp.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WhatsappModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'whatsapp_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  const logger = new Logger('Whatsapp - Bootstrap');

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
  logger.log('WhatsApp microservice is running...');
}
bootstrap();
