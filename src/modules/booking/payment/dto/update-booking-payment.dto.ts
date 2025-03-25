import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BookingPaymentWithRelationsDto } from './booking-payment.dto';
import { CreateBookingPaymentDto } from './create-booking-payment.dto';

export class UpdateBookingPaymentDto extends PartialType(
  CreateBookingPaymentDto,
) {}

export class UpdateBookingPaymentSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentWithRelationsDto>
{
  readonly data: BookingPaymentWithRelationsDto;

  constructor(data: BookingPaymentWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update booking payment success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
