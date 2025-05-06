import { BestSeller, DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ActivityWithRelationsDto } from './activity.dto';

export class GetActivityBestSellerQueryDto {
  @IsEnum(BestSeller, {
    message: `get activity best seller option must be one of: ${Object.values(BestSeller).join(', ')}`,
  })
  @IsNotEmpty()
  option: BestSeller = BestSeller.Rating;
}

export class GetActivityBestSellerDto {
  readonly data!: ActivityWithRelationsDto[];
}

export class GetActivityPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: ActivityWithRelationsDto[];
}

export class GetActivitiesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetActivityPaginateDto>
{
  readonly data: GetActivityPaginateDto;

  constructor(data: GetActivityPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activities success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetActivitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityWithRelationsDto>
{
  readonly data: ActivityWithRelationsDto;

  constructor(data: ActivityWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activity success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetActivityBestSellerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetActivityBestSellerDto>
{
  readonly data: GetActivityBestSellerDto;

  constructor(data: GetActivityBestSellerDto, option: BestSeller) {
    super({
      code: HttpStatus.OK,
      message: `get activity best seller based on ${option} success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
