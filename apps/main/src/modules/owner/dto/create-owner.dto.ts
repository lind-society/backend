import {
  PhoneNumberValidator,
  RegexValidator,
} from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import { OwnerStatus, OwnerType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { OwnerDto } from './owner.dto';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(OwnerType, {
    message: `owner type must be one of: ${Object.values(OwnerType).join(', ')}`,
  })
  @IsNotEmpty()
  readonly type!: OwnerType;

  @IsString()
  @IsNotEmpty()
  readonly companyName!: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @RegexValidator('phoneCountryCode')
  @IsNotEmpty()
  readonly phoneCountryCode!: string;

  @IsNumberString()
  @RegexValidator('phoneNumber')
  @PhoneNumberValidator('phoneCountryCode')
  @IsNotEmpty()
  readonly phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @IsString()
  @IsOptional()
  readonly website!: string;

  @IsEnum(OwnerStatus)
  @IsNotEmpty()
  readonly status!: OwnerStatus;
}

export class CreateOwnerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<OwnerDto>
{
  readonly data: OwnerDto;

  constructor(data: OwnerDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create owner success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
