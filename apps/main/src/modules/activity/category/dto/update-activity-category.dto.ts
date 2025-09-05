import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { ActivityCategoryWithRelationsDto } from './activity-category.dto';
import { CreateActivityCategoryDto } from './create-activity-category.dto';

export class UpdateActivityCategoryDto extends PartialType(
  CreateActivityCategoryDto,
) {}

export class UpdateActivityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityCategoryWithRelationsDto>
{
  readonly data: ActivityCategoryWithRelationsDto;

  constructor(data: ActivityCategoryWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update activity category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
