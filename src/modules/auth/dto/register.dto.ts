import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import { CreateAdminDto } from 'src/modules/admin/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

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
