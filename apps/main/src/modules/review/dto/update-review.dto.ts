import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { CreateReviewDto } from './create-review.dto';
import { ReviewWithRelationsDto } from './review.dto';

export class UpdateReviewDto extends CreateReviewDto {}

export class UpdateReviewSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ReviewWithRelationsDto>
{
  readonly data: ReviewWithRelationsDto;

  constructor(data: ReviewWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update review success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
