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
import {
  HttpResponse,
  ValidationExceptionResponse,
} from 'src/modules/shared/dto';
import { QueryFailedError } from 'typeorm';
import { DefaultHttpStatus } from '../enums';
import { TypeOrmExceptionFilter } from './typeorm-exception.filter';
import { XenditExceptionFilter } from './xendit-exception.filter';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private xenditExceptionFilter = new XenditExceptionFilter();
  private typeOrmExceptionFilter = new TypeOrmExceptionFilter();

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof QueryFailedError) {
      console.error('Typeorm / Database error');
      console.error('========================\n');
      return this.typeOrmExceptionFilter.catch(exception, host);
    }

    if (exception?.response?.error_code && exception?.response?.message) {
      console.error('Xendit API error');
      console.error('================\n');
      return this.xenditExceptionFilter.catch(exception, host);
    }

    console.error('HTTP Exception');
    console.error(exception);

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
