import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { BookingPaymentWithRelationsDto } from './booking-payment.dto';

export class GetBookingPaymentsDto {
  @IsUUID()
  @IsOptional()
  bookingId?: string;
}

export class GetBookingPaymentPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BookingPaymentWithRelationsDto[];
}

export class GetBookingPaymentsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBookingPaymentPaginateDto>
{
  readonly data: GetBookingPaymentPaginateDto;

  constructor(data: GetBookingPaymentPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payments success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingPaymentSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentWithRelationsDto>
{
  readonly data: BookingPaymentWithRelationsDto;

  constructor(data: BookingPaymentWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
