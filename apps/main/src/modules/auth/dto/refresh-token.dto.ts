import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';

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
