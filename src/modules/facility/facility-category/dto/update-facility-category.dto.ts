import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { FacilityCategoryDto } from './facility-category.dto';
import { CreateFacilityCategoryDto } from './create-facility-category.dto';
import { PartialType } from '@nestjs/mapped-types';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { DefaultHttpStatus } from 'src/common/enums';

export class UpdateFacilityCategoryDtoPayload extends PartialType(
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
