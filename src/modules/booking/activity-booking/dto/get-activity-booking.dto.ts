import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { ActivityBookingWithRelationsDto } from './activity-booking.dto';

export class GetActivityBookingsDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;
}

export class GetActivityBookingPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: ActivityBookingWithRelationsDto[];
}

export class GetActivityBookingsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetActivityBookingPaginateDto>
{
  readonly data: GetActivityBookingPaginateDto;

  constructor(data: GetActivityBookingPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activity bookings success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetActivityBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityBookingWithRelationsDto>
{
  readonly data: ActivityBookingWithRelationsDto;

  constructor(data: ActivityBookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get activity booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
