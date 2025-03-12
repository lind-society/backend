import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envPaths } from './common/constants';
import {
  appConfig,
  databaseConfig,
  gcpConfig,
  storageConfig,
  validateEnv,
  xenditConfig,
} from './config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { FacilityModule } from './modules/facility/facility.module';
import { OwnerModule } from './modules/owner/owner.module';
import { PropertyModule } from './modules/property/property.module';
import { LoggerModule } from './modules/shared/logger/logger.module';
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
      load: [appConfig, databaseConfig, gcpConfig, storageConfig, xenditConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    LoggerModule,
    BlogModule,
    FacilityModule,
    PropertyModule,
    VillaModule,
    StorageModule,
    AdminModule,
    OwnerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
