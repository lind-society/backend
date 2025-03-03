import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { AdditionalType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { UpdateMediaDto } from '../media/dto/update-media.dto';
import { AdditionalWithRelationsDto } from './additional.dto';
import { CreateAdditionalDto } from './create-additional.dto';

export class UpdateAdditionalDto extends PartialType(CreateAdditionalDto) {
  @IsString()
  @IsOptional()
  readonly name?: string | null;

  @IsEnum(AdditionalType)
  @IsOptional()
  readonly type?: AdditionalType;

  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateMediaDto)
  readonly medias?: UpdateMediaDto[];
}

export class UpdateAdditionalSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdditionalWithRelationsDto>
{
  readonly data: AdditionalWithRelationsDto;

  constructor(data: AdditionalWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update additional success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
