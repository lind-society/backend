import { ConfigService } from '@nestjs/config';
import { megabyteToByte } from '../helpers';

// deprecated (keep for future use)
export class FileConfig {
  static photosLimitQuantity: number;
  static photosLimitSize: number;
  static videosLimitQuantity: number;
  static videosLimitSize: number;
  static video360sLimitQuantity: number;
  static video360sLimitSize: number;

  constructor(configService: ConfigService) {
    FileConfig.photosLimitQuantity = configService.get<number>(
      'file.photos.limitQuantity',
      10,
    );
    FileConfig.photosLimitSize = configService.get<number>(
      'file.photos.limitSize',
      megabyteToByte(2),
    );
    FileConfig.videosLimitQuantity = configService.get<number>(
      'file.videos.limitQuantity',
      5,
    );
    FileConfig.videosLimitSize = configService.get<number>(
      'file.videos.limitSize',
      megabyteToByte(20),
    );
    FileConfig.video360sLimitQuantity = configService.get<number>(
      'file.video360s.limitQuantity',
      5,
    );
    FileConfig.video360sLimitSize = configService.get<number>(
      'file.video360s.limitSize',
      megabyteToByte(30),
    );
  }
}
