import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { ReviewPaginationDto, ReviewWithRelationsDto } from './review.dto';

export class GetReviewPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: ReviewPaginationDto[];
}

export class GetReviewsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetReviewPaginateDto>
{
  readonly data: GetReviewPaginateDto;

  constructor(data: GetReviewPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get reviews success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetReviewSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ReviewWithRelationsDto>
{
  readonly data: ReviewWithRelationsDto;

  constructor(data: ReviewWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get review success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
