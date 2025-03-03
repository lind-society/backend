import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateFeatureDto } from './create-feature.dto';
import { FeatureWithRelationsDto } from './feature.dto';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {
  @IsString()
  @IsOptional()
  readonly name?: string | null;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly list?: string[] | null;
}

export class UpdateFeatureSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FeatureWithRelationsDto>
{
  readonly data: FeatureWithRelationsDto;

  constructor(data: FeatureWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update feature success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
