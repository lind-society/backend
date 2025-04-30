import { Storage } from '@google-cloud/storage';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from 'src/common/enums';
import { GCPStorageProvider } from './providers';

export const StorageFactory: Provider = {
  provide: 'STORAGE_PROVIDER',
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
