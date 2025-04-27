import { HttpStatus } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateReviewDto } from './create-review.dto';
import { ReviewWithRelationsDto } from './review.dto';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, [
    'activityBookingId',
    'villaBookingId',
    'activityId',
    'villaId',
  ] as const),
) {}

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
