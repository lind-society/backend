import { Module } from '@nestjs/common';
import { MinIOProvider } from './providers/minio';
import { S3Provider } from './providers/s3';
import { StorageController } from './storage.controller';
import { StorageFactory } from './storage.factory';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, StorageFactory, MinIOProvider, S3Provider],
})
export class StorageModule {}
