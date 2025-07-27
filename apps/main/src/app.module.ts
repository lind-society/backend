import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envPaths } from './common/constants';
import { HalInterceptor, SetHttpCodeInterceptor } from './common/interceptors';
import {
  appConfig,
  currencyConfig,
  databaseConfig,
  fileConfig,
  frontEndConfig,
  gcpConfig,
  jwtConfig,
  paymentConfig,
  postalCodeConfig,
  regionConfig,
  storageConfig,
  validateEnv,
  xenditConfig,
} from './config';
import { ActivityModule } from './modules/activity/activity.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { BookingModule } from './modules/booking/booking.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { FacilityModule } from './modules/facility/facility.module';
import { OwnerModule } from './modules/owner/owner.module';
import { PackageModule } from './modules/package/package.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PropertyModule } from './modules/property/property.module';
import { ReviewModule } from './modules/review/review.module';
import { SearchModule } from './modules/search/search.module';
import { AxiosModule } from './modules/shared/axios/axios.module';
import { RegionModule } from './modules/shared/region/region.module';
import { StorageModule } from './modules/shared/storage/storage.module';
import { VillaModule } from './modules/villa/villa.module';
import { PaymentChannelModule } from './modules/payment-channel/payment-channel.module';

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
      load: [
        appConfig,
        currencyConfig,
        databaseConfig,
        fileConfig,
        frontEndConfig,
        gcpConfig,
        jwtConfig,
        paymentConfig,
        postalCodeConfig,
        regionConfig,
        storageConfig,
        xenditConfig,
      ],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AxiosModule,
    StorageModule,
    AuthModule,
    AdminModule,
    ActivityModule,
    BlogModule,
    BookingModule,
    CurrencyModule,
    FacilityModule,
    PropertyModule,
    OwnerModule,
    RegionModule,
    VillaModule,
    ReviewModule,
    PackageModule,
    SearchModule,
    PaymentModule,
    PaymentChannelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SetHttpCodeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HalInterceptor,
    },
  ],
})
export class AppModule {}
