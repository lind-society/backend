import { HttpResponse } from '@apps/main/modules/shared/dto';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DefaultHttpStatus } from '../enums';

@Catch()
export class GCPExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GCPExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.response.statusCode;
    let message = 'Google Cloud Storage error';

    // Extract specific error message if available
    if (exception.errors && exception.errors.length > 0) {
      message = exception.errors[0].message || message;
    }

    this.logger.error(exception);

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
