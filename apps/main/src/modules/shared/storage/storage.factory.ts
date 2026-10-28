import { StorageProvider } from '@apps/main/common/enums';
import { MainProvider, StorageClientProvider } from '@libs/common/enums';
import { S3Client } from '@aws-sdk/client-s3';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinIOStorageProvider } from './providers/minio/minio-storage.provider';
import { S3StorageProvider } from './providers/s3/s3-storage.provider';

export const StorageFactory: Provider = {
  provide: MainProvider.Storage,
  useFactory: async (
    configService: ConfigService,
    minioClient?: Client,
    s3Client?: S3Client,
  ) => {
    const provider = configService.get<string>('storage.currentProvider');

    switch (provider) {
      case StorageProvider.S3: {
        if (!s3Client) {
          throw new InternalServerErrorException('S3 client not available');
        }

        return new S3StorageProvider(s3Client, configService);
      }
      case StorageProvider.GCP:
        throw new InternalServerErrorException('invalid storage provider');
      case StorageProvider.MINIO: {
        if (!minioClient) {
          throw new InternalServerErrorException('MinIO client not available');
        }

        const minioProvider = new MinIOStorageProvider(
          minioClient,
          configService,
        );
        // Not a lifecycle hook — this instance is hand-constructed above,
        // not registered with Nest's DI, so nothing else would ever call it.
        await minioProvider.ensureBucketProvisioned();

        return minioProvider;
      }
      default:
        throw new InternalServerErrorException('invalid storage provider');
    }
  },
  inject: [ConfigService, StorageClientProvider.MINIO, StorageClientProvider.S3],
};
