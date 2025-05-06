import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import { FileType } from '../enums';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const type = file.mimetype.split('/')[0];
  const extension = file.mimetype.split('/')[1];

  if (type !== FileType.Image) {
    return callback(
      new UnsupportedMediaTypeException(
        `upload failed, only image files are allowed! you're trying to upload ${extension} file`,
      ),
      false,
    );
  }
  callback(null, true);
};

export const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const type = file.mimetype.split('/')[0];
  const extension = file.mimetype.split('/')[1];

  if (type !== FileType.Video) {
    return callback(
      new UnsupportedMediaTypeException(
        `upload failed, only video files are allowed! you're trying to upload ${extension} file`,
      ),
      false,
    );
  }
  callback(null, true);
};
