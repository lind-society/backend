import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { ActivityCategoryDto } from './activity-category.dto';

export class GetActivityCategoriesPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: ActivityCategoryDto[];
}

export class GetActivityCategoriesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetActivityCategoriesPaginateDto>
{
  readonly data: GetActivityCategoriesPaginateDto;

  constructor(data: GetActivityCategoriesPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activity categories success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetActivityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityCategoryDto>
{
  readonly data: ActivityCategoryDto;

  constructor(data: ActivityCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activity category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
