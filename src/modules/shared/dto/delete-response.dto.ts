import { HttpStatus } from '@nestjs/common';
import { HttpResponseDefaultProps } from './http-response.dto';
import { DefaultHttpStatus } from 'src/common/enums';

export class DeleteResponse extends HttpResponseDefaultProps {
  constructor(message: string) {
    super({
      status: DefaultHttpStatus.Success,
      message,
      code: HttpStatus.NO_CONTENT,
    });
  }
}
