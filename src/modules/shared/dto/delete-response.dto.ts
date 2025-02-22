import { HttpStatus } from '@nestjs/common';
import { HttpResponse } from './http-response.dto';
import { DefaultHttpStatus } from 'src/common/enums';

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
