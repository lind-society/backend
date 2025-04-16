import { Module } from '@nestjs/common';
import { GCPProvider } from './providers/clients';
import { StorageController } from './storage.controller';
import { StorageFactory } from './storage.factory';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, StorageFactory, GCPProvider],
})
export class StorageModule {}
