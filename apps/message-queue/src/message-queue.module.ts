import { envPaths } from '@libs/common/constants';
import { MessageQueue } from '@libs/common/entities';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { MessageQueueController } from './message-queue.controller';
import { MessageQueueService } from './message-queue.service';

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
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    TypeOrmModule.forFeature([MessageQueue]),
    ScheduleModule.forRoot(),
    WhatsappClientModule,
    TerminusModule,
  ],
  controllers: [MessageQueueController],
  providers: [MessageQueueService],
})
export class MessageQueueModule {}
