import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { regexValidator } from 'src/common/constants';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

export class LoginRequestDto {
  @IsString()
  @Matches(regexValidator.identifier.regex, {
    message: regexValidator.identifier.message,
  })
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
  @ApiProperty({ type: LoginResponseDto })
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
