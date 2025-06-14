import { WHATSAPP_QUEUE } from '@libs/common/constants';
import { getClientConfig, setupDeadLetterQueue, setupRetryQueue } from '@libs/rabbitmq/services';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { WhatsappModule } from './whatsapp.module';

async function bootstrap() {
  await setupDeadLetterQueue(process.env.RABBITMQ_URL, WHATSAPP_QUEUE);
  await setupRetryQueue(process.env.RABBITMQ_URL, WHATSAPP_QUEUE);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(WhatsappModule, {
      ...getClientConfig(process.env.RABBITMQ_URL, WHATSAPP_QUEUE),
    });

  const logger = new Logger('Whatsapp - Bootstrap');

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
  logger.log('WhatsApp microservice is running...');
}
bootstrap();
