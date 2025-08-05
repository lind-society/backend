import { envPaths } from '@libs/common/constants/env-path.constant';
import { SetHttpCodeInterceptor } from '@libs/common/interceptors';
import { MailClientModule } from '@libs/mail-client';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig, clientWhitelistConfig, validateEnv } from './config';
import { MailGatewayController } from './modules/mail';
import { WhatsappGatewayController } from './modules/whatsapp';

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
      load: [appConfig, clientWhitelistConfig],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
    MailClientModule,
    WhatsappClientModule,
  ],
  controllers: [MailGatewayController, WhatsappGatewayController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SetHttpCodeInterceptor,
    },
  ],
})
export class ExternalGatewayModule {}
