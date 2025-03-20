import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { ReviewWithRelationsDto } from './review.dto';

export class GetReviewsDto {
  @IsUUID()
  @IsOptional()
  activityId?: string;

  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  villaId?: string;
}

export class GetReviewPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: ReviewWithRelationsDto[];
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
