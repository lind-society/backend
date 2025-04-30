import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePropertyDto } from './create-property.dto';
import { PropertyWithRelationsDto } from './property.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
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

export class UpdatePropertySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PropertyWithRelationsDto>
{
  readonly data: PropertyWithRelationsDto;

  constructor(data: PropertyWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update property success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
