import { RegexValidator } from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { AdminDto } from './admin.dto';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @RegexValidator('password')
  @IsNotEmpty()
  readonly password!: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly phoneNumber!: string;
}

export class CreateAdminSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminDto>
{
  readonly data: AdminDto;

  constructor(data: AdminDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create admin success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
