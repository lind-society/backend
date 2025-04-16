import { RegexValidator } from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @RegexValidator('identifier')
  @IsNotEmpty()
  readonly identifier!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}

export class LoginResponseDto {
  readonly accessToken!: string;
  readonly refreshToken!: string;
}

export class LoginSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<LoginResponseDto>
{
  readonly data: LoginResponseDto;

  constructor(data: LoginResponseDto) {
    super({
      code: HttpStatus.OK,
      message: 'login success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
