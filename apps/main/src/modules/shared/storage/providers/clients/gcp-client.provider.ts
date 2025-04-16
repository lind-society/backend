import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

export const GCPProvider = {
  provide: 'GCP_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Storage({
      projectId: configService.get<string>('gcp.projectId'),
      keyFilename: configService.get<string>('gcp.keyFilePath'),
    });
  },
  inject: [ConfigService],
};
