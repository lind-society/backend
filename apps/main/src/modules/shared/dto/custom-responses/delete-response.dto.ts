import { DefaultHttpStatus } from '@apps/main/common/enums';
import { HttpStatus } from '@nestjs/common';
import { HttpResponse } from '../http-response.dto';

export class DeleteResponse extends HttpResponse {
  constructor(message: string) {
    super({
      status: DefaultHttpStatus.Success,
      message,
      code: HttpStatus.OK,
      data: null,
    });
  }
}
