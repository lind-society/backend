import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from './http-response.dto';

export class ValidationExceptionResponseData {
  readonly field!: string;
  readonly message!: string[];
}

export class ValidationExceptionResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ValidationExceptionResponseData[]>
{
  readonly data: ValidationExceptionResponseData[];

  constructor(options: HttpResponseOptions<ValidationExceptionResponseData[]>) {
    super({
      status: DefaultHttpStatus.Fail,
      message: 'unprocessable entity',
      code: HttpStatus.UNPROCESSABLE_ENTITY,
    });

    this.data = options.data;
  }
}
