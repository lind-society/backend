import { DefaultHttpStatus } from '@apps/main/common/enums';
import { AdditionalType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdditionalWithRelationsDto } from './additional.dto';

export class CreateAdditionalDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(AdditionalType, {
    message: `additional type must be one of: ${Object.values(AdditionalType).join(', ')}`,
  })
  @IsNotEmpty()
  readonly type!: AdditionalType;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly photos?: string[];
}

export class CreateAdditionalSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdditionalWithRelationsDto>
{
  readonly data: AdditionalWithRelationsDto;

  constructor(data: AdditionalWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create additional success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
