import { StorageClientProvider } from '@libs/common/enums';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3Provider = {
  provide: StorageClientProvider.S3,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      endpoint: configService.get<string>('storage.provider.s3.endpoint'),
      region: configService.get<string>('storage.provider.s3.region'),
      // R2 (and most S3-compatible providers other than AWS itself) needs
      // path-style addressing — virtual-hosted-style (bucket.endpoint/key)
      // only resolves against real AWS DNS.
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.get<string>(
          'storage.provider.s3.accessKeyId',
        ),
        secretAccessKey: configService.get<string>(
          'storage.provider.s3.secretAccessKey',
        ),
      },
    });
  },
  inject: [ConfigService],
};
