import { StorageProvider } from '@apps/main/common/enums';
import { Storage } from '@google-cloud/storage';
import { MainProvider } from '@libs/common/enums';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GCPStorageProvider } from './providers';

export const StorageFactory: Provider = {
  provide: MainProvider.Storage,
  useFactory: (configService: ConfigService, gcpStorage: Storage) => {
    const provider = configService.get<string>('storage.provider');

    switch (provider) {
      case StorageProvider.S3:
        throw new InternalServerErrorException('invalid storage provider');
      case StorageProvider.GCP:
        return new GCPStorageProvider(gcpStorage, configService);
      case StorageProvider.MinIO:
        throw new InternalServerErrorException('invalid storage provider');
      default:
        throw new InternalServerErrorException('invalid storage provider');
    }
  },
  inject: [ConfigService, 'GCP_CLIENT'],
};
