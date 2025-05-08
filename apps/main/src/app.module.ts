import { envPaths } from '@libs/common/constants';
import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHelper } from './common/helpers/config-helper';
import {
  appConfig,
  currencyConfig,
  databaseConfig,
  fileConfig,
  frontEndConfig,
  gcpConfig,
  jwtConfig,
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
import { PropertyModule } from './modules/property/property.module';
import { ReviewModule } from './modules/review/review.module';
import { AxiosModule } from './modules/shared/axios/axios.module';
import { RegionModule } from './modules/shared/region/region.module';
import { StorageModule } from './modules/shared/storage/storage.module';
import { VillaModule } from './modules/villa/villa.module';

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
    LoggerModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, ConfigHelper],
  exports: [ConfigHelper],
})
export class AppModule {}
