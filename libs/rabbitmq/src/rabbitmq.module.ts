import { envPaths } from '@libs/common/constants/env-path.constant';
import { validateEnv } from '@libs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { setRmqOption } from './common/helpers';
import { EnvironmentVariables } from './config/env.config';
import { rabbitMqConfig } from './config/rabbitmq.config';
import { RabbitMqService } from './rabbitmq.service';
import { MessageHandlerService } from './services/message-handler.service';

@Module({
  providers: [RabbitMqService, MessageHandlerService],
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
  exports: [RabbitMqService, MessageHandlerService],
})
export class RabbitMqModule {
  static register(
    clientName: string,
    queue: string,
  ): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: clientName,
            useFactory: (configService: ConfigService) => {
              const options = setRmqOption(configService, queue);
              console.log(
                `Registering RMQ client: ${clientName} for queue: ${queue}`,
              );
              return options;
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
