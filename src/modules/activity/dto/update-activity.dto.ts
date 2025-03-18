import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ActivityWithRelationsDto } from './activity.dto';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}

export class UpdateActivitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityWithRelationsDto>
{
  readonly data: ActivityWithRelationsDto;

  constructor(data: ActivityWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update activity success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
