import { DefaultHttpStatus } from '@apps/main/common/enums';
import { CreateAdminDto } from '@apps/main/modules/admin/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';

export class RegisterRequestDto extends CreateAdminDto {}

export class RegisterResponseDto {
  readonly accessToken!: string;
  readonly refreshToken!: string;
}

export class RegisterSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<RegisterResponseDto>
{
  readonly data: RegisterResponseDto;

  constructor(data: RegisterResponseDto) {
    super({
      code: HttpStatus.OK,
      message: 'register success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
