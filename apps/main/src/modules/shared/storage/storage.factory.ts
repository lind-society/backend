import { StorageProvider } from '@apps/main/common/enums';
import { MainProvider, StorageClientProvider } from '@libs/common/enums';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinIOStorageProvider } from './providers/minio/minio-storage.provider';

export const StorageFactory: Provider = {
  provide: MainProvider.Storage,
  useFactory: (configService: ConfigService, minioClient?: Client) => {
    const provider = configService.get<string>('storage.currentProvider');

    switch (provider) {
      case StorageProvider.S3:
        throw new InternalServerErrorException('invalid storage provider');
      case StorageProvider.GCP:
        throw new InternalServerErrorException('invalid storage provider');
      case StorageProvider.MINIO:
        if (!minioClient) {
          throw new InternalServerErrorException('MinIO client not available');
        }

        return new MinIOStorageProvider(minioClient, configService);
      default:
        throw new InternalServerErrorException('invalid storage provider');
    }
  },
  inject: [ConfigService, StorageClientProvider.MINIO],
};
