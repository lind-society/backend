import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  PHOTOS_LIMIT_QUANTITY,
  PHOTOS_LIMIT_SIZE,
  VIDEOS_LIMIT_QUANTITY,
  VIDEOS_LIMIT_SIZE,
  VIDEO_360S_LIMIT_QUANTITY,
  VIDEO_360S_LIMIT_SIZE,
} = envValues;

export const fileConfig = registerAs('file', () => ({
  photos: {
    limitQuantity: PHOTOS_LIMIT_QUANTITY,
    limitSize: PHOTOS_LIMIT_SIZE,
  },
  videos: {
    limitQuantity: VIDEOS_LIMIT_QUANTITY,
    limitSize: VIDEOS_LIMIT_SIZE,
  },
  video360s: {
    limitQuantity: VIDEO_360S_LIMIT_QUANTITY,
    limitSize: VIDEO_360S_LIMIT_SIZE,
  },
}));
