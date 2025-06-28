import { DefaultHttpStatus } from '@apps/main/common/enums';
import { BookingType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
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

  constructor(data: GetBookingPaginateDto, type?: BookingType) {
    super({
      code: HttpStatus.OK,
      message: `get ${type?.toLowerCase() ?? ''} bookings success`,
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

  constructor(data: BookingWithRelationsDto, type: BookingType) {
    super({
      code: HttpStatus.OK,
      message: `get ${type.toLowerCase()} booking success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
