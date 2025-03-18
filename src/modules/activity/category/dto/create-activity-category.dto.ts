import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ActivityCategoryDto } from './activity-category.dto';

export class CreateActivityCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}

export class CreateActivityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityCategoryDto>
{
  readonly data: ActivityCategoryDto;

  constructor(data: ActivityCategoryDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create activity category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
