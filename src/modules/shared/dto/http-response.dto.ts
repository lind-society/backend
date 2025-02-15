import { DefaultHttpStatus } from 'src/common/enums/default-http-status.enum';

/**
 * @description This project uses the JSend API specification.
 * @see https://github.com/omniti-labs/jsend
 */

export class HttpResponseDefaultOptions {
  readonly status!: DefaultHttpStatus;
  readonly message!: string;
  readonly code!: number;
}

export class HttpResponseOptions<T> {
  readonly status!: DefaultHttpStatus;
  readonly message!: string;
  readonly code!: number;
  readonly data!: T;
}

export class HttpResponseDefaultProps {
  readonly status: DefaultHttpStatus;
  readonly message: string;
  readonly code: number;

  constructor(options: HttpResponseDefaultOptions) {
    this.status = options.status;
    this.message = options.message;
    this.code = options.code;
  }
}

export class HttpResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<any>
{
  readonly data: any;

  constructor(options: HttpResponseOptions<any>) {
    super({
      status: options.status,
      message: options.message,
      code: options.code,
    });

    this.data = options.data;
  }
}
