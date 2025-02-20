import { IsNotEmpty, IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FacilityCategoryDto } from './facility-category.dto';
import { DefaultHttpStatus } from 'src/common/enums';

export class CreateFacilityCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}

export class CreateFacilityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityCategoryDto>
{
  readonly data: FacilityCategoryDto;

  constructor(data: FacilityCategoryDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create facility category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
