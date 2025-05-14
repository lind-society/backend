import { megabyteToByte } from '../helpers';
import { IFileConfig } from '../interfaces';

export const PHOTOS_CONFIG: IFileConfig = {
  quantity: parseInt(process.env.PHOTOS_LIMIT_QUANTITY, 10) || 10,
  size:
    megabyteToByte(parseInt(process.env.PHOTOS_LIMIT_SIZE, 10)) ||
    megabyteToByte(5),
};

export const VIDEOS_CONFIG: IFileConfig = {
  quantity: parseInt(process.env.VIDEOS_LIMIT_QUANTITY, 10) || 5,
  size:
    megabyteToByte(parseInt(process.env.VIDEOS_LIMIT_SIZE, 10)) ||
    megabyteToByte(50),
};

export const VIDEO_360S_CONFIG: IFileConfig = {
  quantity: parseInt(process.env.VIDEO_360S_LIMIT_QUANTITY, 10) || 5,
  size:
    megabyteToByte(parseInt(process.env.VIDEO_360S_LIMIT_SIZE, 10)) ||
    megabyteToByte(15),
};

export const FLOOR_PLANS_CONFIG: IFileConfig = {
  quantity: parseInt(process.env.FLOOR_PLANS_LIMIT_QUANTITY, 10) || 10,
  size:
    megabyteToByte(parseInt(process.env.FLOOR_PLANS_LIMIT_SIZE, 10)) ||
    megabyteToByte(5),
};
