import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

export class RefreshTokenResponseDto {
  readonly accessToken!: string;
  readonly refreshToken!: string;
}

export class RefreshTokenSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<RefreshTokenResponseDto>
{
  readonly data: RefreshTokenResponseDto;

  constructor(data: RefreshTokenResponseDto) {
    super({
      code: HttpStatus.OK,
      message: 'refresh token success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
