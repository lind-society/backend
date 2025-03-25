import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BookingWithRelationsDto } from './booking.dto';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingWithRelationsDto extends PartialType(
  CreateBookingDto,
) {}

export class UpdateBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingWithRelationsDto>
{
  readonly data: BookingWithRelationsDto;

  constructor(data: BookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
