import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envPaths } from './common/constants';
import {
  appConfig,
  currencyConfig,
  databaseConfig,
  fileConfig,
  gcpConfig,
  jwtConfig,
  postalCodeConfig,
  regionConfig,
  storageConfig,
  validateEnv,
  whatsappConfig,
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
import { PropertyModule } from './modules/property/property.module';
import { ReviewModule } from './modules/review/review.module';
import { AxiosModule } from './modules/shared/axios/axios.module';
import { LoggerModule } from './modules/shared/logger/logger.module';
import { RegionModule } from './modules/shared/region/region.module';
import { StorageModule } from './modules/shared/storage/storage.module';
import { WhatsappModule } from './modules/shared/whatsapp/whatsapp.module';
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
        gcpConfig,
        jwtConfig,
        postalCodeConfig,
        regionConfig,
        storageConfig,
        whatsappConfig,
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
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
