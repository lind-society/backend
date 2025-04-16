import { DefaultHttpStatus } from '@apps/main/common/enums';
import { HttpStatus } from '@nestjs/common';
import { HttpResponse } from '../http-response.dto';

export class LogoutResponse extends HttpResponse {
  constructor() {
    super({
      status: DefaultHttpStatus.Success,
      message: 'logout success',
      code: HttpStatus.OK,
      data: null,
    });
  }
}
