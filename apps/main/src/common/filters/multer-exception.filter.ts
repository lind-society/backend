import { HttpResponse } from '@apps/main/modules/shared/dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';
import { DefaultHttpStatus } from '../enums';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let message = 'file upload error';
    let statusCode = HttpStatus.BAD_REQUEST;

    let maxFileQuantity: string;
    let maxFileSize: string;
    let entity: string;

    if (request.url.includes('photos')) {
      entity = 'photo';
      maxFileQuantity = process.env.PHOTOS_LIMIT_QUANTITY || '10';
      maxFileSize = process.env.PHOTOS_LIMIT_SIZE || '2';
    } else if (request.url.includes('videos')) {
      entity = 'video';
      maxFileQuantity = process.env.VIDEOS_LIMIT_QUANTITY || '5';
      maxFileSize = process.env.VIDEOS_LIMIT_SIZE || '20';
    } else if (request.url.includes('video360s')) {
      entity = 'video360';
      maxFileQuantity = process.env.VIDEO360S_LIMIT_QUANTITY || '5';
      maxFileSize = process.env.VIDEO360S_LIMIT_SIZE || '30';
    }

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        message += ` : ${entity} file size exceeds the allowed limit of ${maxFileSize} MB`;
        statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
        break;
      case 'LIMIT_FILE_COUNT':
        message += ` : too many ${entity} files uploaded, max ${maxFileQuantity} each upload process`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message += ' : unexpected file field';
        break;
      default:
        message = exception.message;
    }

    return response.status(statusCode).json(
      new HttpResponse({
        code: statusCode,
        message,
        status: DefaultHttpStatus.Fail,
        data: null,
      }),
    );
  }
}
