import { envPaths } from '@apps/main/common/constants';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
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
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.config.host'),
          secure: false,
          auth: {
            user: configService.get<string>('mail.config.user'),
            pass: configService.get<string>('mail.config.password'),
          },
        },
        defaults: {
          from: `${configService.get<string>('mail.sender.name')} <${configService.get<string>('mail.sender.email')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'views'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
