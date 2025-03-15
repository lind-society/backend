import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from 'src/modules/shared/dto';
import { QueryFailedError } from 'typeorm';
import { DefaultHttpStatus } from '../enums';
import { PostgreSqlErrorCode } from '../enums/postgresql-error-code.enum';
import { sanitizePostgresqlErrorResponse } from '../helpers/sanitize-postgresql-error-response.helper';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception.message;
    let responseCode = HttpStatus.BAD_REQUEST;

    const driverError = (exception as any).driverError;
    const errorCode = driverError?.code;

    if (errorCode === PostgreSqlErrorCode.Conflict) {
      responseCode = HttpStatus.CONFLICT;
      message = sanitizePostgresqlErrorResponse(
        driverError?.detail ?? 'duplicated entry',
      );
    }

    console.error(exception);

    return response.status(responseCode).json(
      new HttpResponse({
        code: responseCode,
        message,
        status: DefaultHttpStatus.Fail,
        data: null,
      }),
    );
  }
}
