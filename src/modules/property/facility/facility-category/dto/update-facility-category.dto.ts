import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateFacilityCategoryDto } from './create-facility-category.dto';
import { FacilityCategoryDto } from './facility-category.dto';

export class UpdateFacilityCategoryDto extends PartialType(
  CreateFacilityCategoryDto,
) {
  @IsString()
  @IsOptional()
  readonly name?: string;
}

export class UpdateFacilityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityCategoryDto>
{
  readonly data: FacilityCategoryDto;

  constructor(data: FacilityCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'update facility category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
