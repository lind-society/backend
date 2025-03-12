import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
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

  @IsBoolean()
  @IsOptional()
  readonly free?: boolean | null;

  @IsString()
  @IsOptional()
  readonly priceCurrency?: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price must be a valid number' },
  )
  @Min(0, { message: 'minimum price is 0' })
  @IsOptional()
  readonly price?: number | null;

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
