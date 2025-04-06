import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegexValidator } from 'src/common/decorators';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

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
