import { HttpResponse } from '@apps/main/modules/shared/dto';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DefaultHttpStatus } from '../enums';

@Catch()
export class XenditExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(XenditExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception.response?.data);

    // Conditional error messages
    let responseMessage = `${exception.response.data?.error_code} : ${exception.response.data?.message}`;

    // Transform Xendit Error into `HttpResponse` format
    return response.status(exception.status).json(
      new HttpResponse({
        code: exception.status,
        message: responseMessage,
        status: DefaultHttpStatus.Fail,
        data: exception.response.data.errors ?? null,
      }),
    );

    // Default Handling for other errors
    // return response.status(status).json(
    //   new HttpResponse({
    //     code: status,
    //     data: null,
    //     message: exception.message || 'Something went wrong',
    //     status:
    //       status >= 400 && status < 500
    //         ? DefaultHttpStatus.Fail
    //         : DefaultHttpStatus.Error,
    //   }),
    // );
  }
}
