import { HttpStatus } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FeatureWithRelationsDto } from './feature.dto';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly list?: string[] | null;
}

export class CreateFeatureSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FeatureWithRelationsDto>
{
  readonly data: FeatureWithRelationsDto;

  constructor(data: FeatureWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create feature success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
