import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';

export const GCPProvider = {
  provide: 'GCP_CLIENT',
  useFactory: (configService: ConfigService) => {
    const keyFilePath = configService.get<string>('gcp.keyFilePath');

    if (!existsSync(keyFilePath)) {
      throw new Error(`GCP credentials file not found at path: ${keyFilePath}`);
    }

    return new Storage({
      projectId: configService.get<string>('gcp.projectId'),
      keyFilename: keyFilePath,
    });
  },
  inject: [ConfigService],
};
