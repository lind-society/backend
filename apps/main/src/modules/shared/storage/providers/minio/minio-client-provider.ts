// providers/clients/minio-client.provider.ts
import { StorageClientProvider } from '@libs/common/enums';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MinIOProvider = {
  provide: StorageClientProvider.MINIO,
  useFactory: (configService: ConfigService) => {
    return new Client({
      endPoint: configService.get<string>('storage.provider.minio.endpoint'),
      port: configService.get<number>('storage.provider.minio.port'),
      useSSL: configService.get<boolean>('storage.provider.minio.useSSL'),
      accessKey: configService.get<string>('storage.provider.minio.accessKey'),
      secretKey: configService.get<string>('storage.provider.minio.secretKey'),
    });
  },
  inject: [ConfigService],
};
