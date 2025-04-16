import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CreateVillaDto } from './create-villa.dto';
import { VillaWithRelationsDto } from './villa.dto';

export class UpdateVillaDto extends PartialType(CreateVillaDto) {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'average rating must be a valid number' },
  )
  @Min(0, { message: 'minimum average rating is 0' })
  @Max(5, { message: 'maximum average rating is 5' })
  @IsOptional()
  readonly averageRating?: number;
}

export class UpdateVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithRelationsDto>
{
  readonly data: VillaWithRelationsDto;

  constructor(data: VillaWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
