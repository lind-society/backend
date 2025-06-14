import { envPaths } from '@libs/common/constants';
import {
  LibEnvironmentVariables,
  rabbitMqConfig,
  validateEnv,
} from '@libs/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMqService } from './rabbitmq.service';
import { DeadLetterHandlerService, MessagePublisherService } from './services';

@Module({
  providers: [MessagePublisherService, DeadLetterHandlerService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths[process.env.NODE_ENV || 'development'],
      validate: validateEnv(LibEnvironmentVariables),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      load: [rabbitMqConfig],
    }),
  ],
  exports: [RabbitMqService, MessagePublisherService, DeadLetterHandlerService],
})
export class RabbitMqModule {}
