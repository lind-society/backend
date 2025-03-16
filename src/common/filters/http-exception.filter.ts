import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  PayloadTooLargeException,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { MulterError } from 'multer';
import {
  HttpResponse,
  ValidationExceptionResponse,
} from 'src/modules/shared/dto';
import { QueryFailedError } from 'typeorm';
import { XenditSdkError } from 'xendit-node';
import { DefaultHttpStatus } from '../enums';
import { GCPExceptionFilter } from './gcp-exception.filter';
import { MulterExceptionFilter } from './multer-exception.filter';
import { TypeOrmExceptionFilter } from './typeorm-exception.filter';
import { XenditExceptionFilter } from './xendit-exception.filter';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private gcpExceptionFilter = new GCPExceptionFilter();
  private multerExceptionFilter = new MulterExceptionFilter();
  private typeOrmExceptionFilter = new TypeOrmExceptionFilter();
  private xenditExceptionFilter = new XenditExceptionFilter();

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

    if (
      exception instanceof XenditSdkError ||
      (exception?.response?.error_code && exception?.response?.message)
    ) {
      console.error('Xendit API error');
      console.error('================\n');

      return this.xenditExceptionFilter.catch(exception, host);
    }

    if (
      exception instanceof PayloadTooLargeException ||
      exception instanceof MulterError ||
      (exception instanceof BadRequestException &&
        exception.message.includes('Unexpected field') &&
        exception.message.includes('file'))
    ) {
      exception instanceof MulterError
        ? console.error('Multer error')
        : exception instanceof MulterError
          ? console.error('Nest payload max limit error')
          : console.error('Nest payload max size error');

      console.error('================\n');

      const normalizedException =
        exception instanceof PayloadTooLargeException
          ? new MulterError('LIMIT_FILE_SIZE')
          : exception instanceof BadRequestException
            ? new MulterError('LIMIT_FILE_COUNT')
            : exception;

      return this.multerExceptionFilter.catch(normalizedException, host);
    }

    if (
      exception.code &&
      exception.errors &&
      Array.isArray(exception.errors) &&
      exception.response &&
      exception.response.statusCode
    ) {
      console.error('GCP error');
      console.error('========================\n');

      return this.gcpExceptionFilter.catch(exception, host);
    }

    console.error('HTTP Exception');
    console.error('================\n');
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
