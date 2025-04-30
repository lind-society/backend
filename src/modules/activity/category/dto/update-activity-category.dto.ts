import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ActivityCategoryDto } from './activity-category.dto';
import { CreateActivityCategoryDto } from './create-activity-category.dto';

export class UpdateActivityCategoryDto extends PartialType(CreateActivityCategoryDto) {}

export class UpdateActivityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityCategoryDto>
{
  readonly data: ActivityCategoryDto;

  constructor(data: ActivityCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'update activity category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
