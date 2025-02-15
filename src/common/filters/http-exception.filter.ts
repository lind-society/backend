import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { HttpResponse } from 'src/modules/shared/dto/http-response.dto';
import { DefaultHttpStatus } from '../enums/default-http-status.enum';
import { ValidationExceptionResponse } from 'src/modules/shared/dto/validation-exception-response.dto';
import { XenditExceptionFilter } from './xendit-exception.filter';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private xenditExceptionFilter: XenditExceptionFilter;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.xenditExceptionFilter = new XenditExceptionFilter();
  }

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('🔥 Exception:', exception);

    if (exception?.response?.error_code && exception?.response?.message) {
      return this.xenditExceptionFilter.catch(exception, host);
    }

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
            message: Object.values(error.constraints ?? {}),
          })),
          message: 'Unprocessable entity',
          status: DefaultHttpStatus.Fail,
        }),
        status,
      );
    }

    // 🔹 Default Error Handling
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
