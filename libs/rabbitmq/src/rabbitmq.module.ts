import { envPaths } from '@libs/common/constants/env-path.constant';
import { validateEnv } from '@libs/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.config';
import { rabbitMqConfig } from './config/rabbitmq.config';
import { RabbitMqService } from './rabbitmq.service';

@Module({
  providers: [RabbitMqService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths[process.env.NODE_ENV || 'development'],
      validate: (config) => validateEnv(config, EnvironmentVariables),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      load: [rabbitMqConfig],
    }),
  ],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
