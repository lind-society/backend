import { ConfigService } from '@nestjs/config';
import { megabyteToByte } from '../../../../common/helpers/size-converter.helper';
import { IFileConfig } from '../../../../common/interfaces';

// Not used due to interceptor in storage controller cannot use class property (this) -> keep for future use
export class FileConfigHelper {
  private readonly _photos: IFileConfig;
  private readonly _videos: IFileConfig;
  private readonly _video360s: IFileConfig;
  private readonly _floorPlans: IFileConfig;

  constructor(private readonly configService: ConfigService) {
    this._photos = {
      quantity: this.configService.get<number>('file.photos.limitQuantity', 10),
      size: megabyteToByte(
        this.configService.get<number>('file.photos.limitSize', 5),
      ),
    };

    this._videos = {
      quantity: this.configService.get<number>('file.videos.limitQuantity', 5),
      size: megabyteToByte(
        this.configService.get<number>('file.videos.limitSize', 50),
      ),
    };

    this._video360s = {
      quantity: this.configService.get<number>(
        'file.video360s.limitQuantity',
        5,
      ),
      size: megabyteToByte(
        this.configService.get<number>('file.video360s.limitSize', 10),
      ),
    };

    this._floorPlans = {
      quantity: this.configService.get<number>(
        'file.floorPlans.limitQuantity',
        5,
      ),
      size: megabyteToByte(
        this.configService.get<number>('file.floorPlans.limitSize', 10),
      ),
    };
  }

  get photosLimitQuantity(): number {
    return this._photos.quantity;
  }

  get photosLimitSize(): number {
    return this._photos.size;
  }

  get videosLimitQuantity(): number {
    return this._videos.quantity;
  }

  get videosLimitSize(): number {
    return this._videos.size;
  }

  get video360sLimitQuantity(): number {
    return this._video360s.quantity;
  }

  get video360sLimitSize(): number {
    return this._video360s.size;
  }

  get floorPlansLimitQuantity(): number {
    return this._floorPlans.quantity;
  }

  get floorPlansLimitSize(): number {
    return this._floorPlans.size;
  }
}
