import { HttpStatus } from '@nestjs/common';

export class HttpErrorResponse {
  static create(
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = 'Internal server error',
    data: any = null,
  ) {
    return {
      status: 'error',
      message,
      code: status,
      data,
    };
  }
}
