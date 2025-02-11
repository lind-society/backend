import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './modules/payment/payment.module';
import { validateEnv } from './config/env.config';
import { envPaths } from './common/constants/env-path.constant';
import { appConfig } from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { xenditConfig } from './config/xendit.config';
import { LoggerModule } from './modules/shared/logger/logger.module';

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
      load: [appConfig, xenditConfig],
    }),
    PaymentModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
