import { envPaths } from '@libs/common/constants';
import { RabbitMqModule } from '@libs/rabbitmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setMailOption } from './common/helpers';
import { mailConfig, validateEnv } from './config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths[process.env.NODE_ENV || 'development'],
      validate: validateEnv,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      load: [mailConfig],
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        setMailOption(configService),
      inject: [ConfigService],
    }),
    RabbitMqModule,
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
