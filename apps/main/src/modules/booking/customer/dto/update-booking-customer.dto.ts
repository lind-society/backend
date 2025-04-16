import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { BookingCustomerDto } from './booking-customer.dto';
import { CreateBookingCustomerDto } from './create-booking-customer.dto';

export class UpdateBookingCustomerDto extends PartialType(
  CreateBookingCustomerDto,
) {}

export class UpdateBookingCustomerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingCustomerDto>
{
  readonly data: BookingCustomerDto;

  constructor(data: BookingCustomerDto) {
    super({
      code: HttpStatus.OK,
      message: 'update booking customer success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
