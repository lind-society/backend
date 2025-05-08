import { HttpResponse } from '@apps/main/modules/shared/dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DefaultHttpStatus } from '../enums';

@Catch()
export class XenditExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Transform Xendit Error into `HttpResponse` format
    if (exception?.response?.error_code && exception?.response?.message) {
      return response.status(HttpStatus.BAD_REQUEST).json(
        new HttpResponse({
          code: HttpStatus.BAD_REQUEST,
          message: `${exception.response.error_code} : ${exception.response.message}`,
          status: DefaultHttpStatus.Fail,
          data: null,
        }),
      );
    }

    console.error(exception);

    // Default Handling for other errors
    return response.status(status).json(
      new HttpResponse({
        code: status,
        data: null,
        message: exception.message || 'Something went wrong',
        status:
          status >= 400 && status < 500
            ? DefaultHttpStatus.Fail
            : DefaultHttpStatus.Error,
      }),
    );
  }
}
