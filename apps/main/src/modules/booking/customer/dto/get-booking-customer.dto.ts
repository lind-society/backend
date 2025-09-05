import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import {
  BookingCustomerPaginationDto,
  BookingCustomerWithRelationsDto,
} from './booking-customer.dto';

export class GetBookingCustomersDto {
  @IsUUID()
  @IsOptional()
  bookingId?: string;
}

export class GetBookingCustomerPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BookingCustomerPaginationDto[];
}

export class GetBookingCustomersSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBookingCustomerPaginateDto>
{
  readonly data: GetBookingCustomerPaginateDto;

  constructor(data: GetBookingCustomerPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking customers success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingCustomerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingCustomerWithRelationsDto>
{
  readonly data: BookingCustomerWithRelationsDto;

  constructor(data: BookingCustomerWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking customer success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
