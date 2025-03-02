import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { FacilityCategoryDto } from './facility-category.dto';

export class FacilityCategoryParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetFacilityCategoriesPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: FacilityCategoryDto[];
}

export class GetFacilityCategoriesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetFacilityCategoriesPaginateDto>
{
  readonly data: GetFacilityCategoriesPaginateDto;

  constructor(data: GetFacilityCategoriesPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facility categories success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetFacilityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityCategoryDto>
{
  readonly data: FacilityCategoryDto;

  constructor(data: FacilityCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facility category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
