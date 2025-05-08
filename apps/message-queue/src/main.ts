import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MessageQueueModule } from './message-queue.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MessageQueueModule);

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Message Queue - Bootstrap');

  const env = configService.get<string>('app.env');

  logger.log(`env : ${env}`);
  logger.log('Message Queue microservice is running...');
}
bootstrap();
