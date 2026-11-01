import { DefaultHttpStatus } from '@apps/main/common/enums';
import { InquiryType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { InquiryDto } from './inquiry.dto';

export class CreateInquiryDto {
  @IsEnum(InquiryType, {
    message: `inquiry type must be one of: ${Object.values(InquiryType).join(', ')}`,
  })
  readonly type!: InquiryType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name!: string;

  @IsEmail()
  @MaxLength(255)
  readonly email!: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  readonly message?: string;

  @IsUUID()
  @IsOptional()
  readonly referenceId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly referenceName?: string;

  @IsObject()
  @IsOptional()
  readonly metadata?: Record<string, unknown>;
}

export class CreateInquirySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<InquiryDto>
{
  readonly data: InquiryDto;

  constructor(data: InquiryDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create inquiry success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
