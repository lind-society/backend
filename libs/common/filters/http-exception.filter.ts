import {
  HttpResponse,
  ValidationExceptionResponse,
} from '@apps/main/modules/shared/dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { DefaultHttpStatus } from '../enums';
import { extractChildrenErrors } from '../factories';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error('HTTP Exception');
    this.logger.error(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const err =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    if (
      status === HttpStatus.UNPROCESSABLE_ENTITY &&
      typeof err === 'object' &&
      'message' in err &&
      typeof err.message === 'object'
    ) {
      const errors = err.message as ValidationError[];

      return httpAdapter.reply(
        response,
        new ValidationExceptionResponse({
          code: status,
          data: errors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints ?? {}).concat(
              extractChildrenErrors(error.children),
            ),
          })),
          message: 'Unprocessable entity',
          status: DefaultHttpStatus.Fail,
        }),
        status,
      );
    }

    // Default Error Handling
    return httpAdapter.reply(
      response,
      new HttpResponse({
        code: status,
        data: null,
        message: message.toLowerCase(),
        status:
          status >= HttpStatus.BAD_REQUEST &&
          status < HttpStatus.INTERNAL_SERVER_ERROR
            ? DefaultHttpStatus.Fail
            : DefaultHttpStatus.Error,
      }),
      status,
    );
  }
}
