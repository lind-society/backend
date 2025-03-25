import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { BookingWithRelationsDto } from './booking.dto';

export class GetBookingsDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;
}

export class GetBookingPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BookingWithRelationsDto[];
}

export class GetBookingsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBookingPaginateDto>
{
  readonly data: GetBookingPaginateDto;

  constructor(data: GetBookingPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get bookings success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingWithRelationsDto>
{
  readonly data: BookingWithRelationsDto;

  constructor(data: BookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
