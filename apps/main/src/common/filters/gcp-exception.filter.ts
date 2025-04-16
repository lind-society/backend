import { HttpResponse } from '@apps/main/modules/shared/dto';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DefaultHttpStatus } from '../enums';

@Catch()
export class GCPExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.response.statusCode;
    let message = 'Google Cloud Storage error';

    // Extract specific error message if available
    if (exception.errors && exception.errors.length > 0) {
      message = exception.errors[0].message || message;
    }

    return response.status(status).json(
      new HttpResponse({
        code: status,
        data: null,
        message: message.toLowerCase(),
        status: DefaultHttpStatus.Fail,
      }),
    );
  }
}
