import { DefaultHttpStatus } from '@apps/main/common/enums';
import { BookingType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { BookingWithRelationsDto } from './booking.dto';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}

export class UpdateBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingWithRelationsDto>
{
  readonly data: BookingWithRelationsDto;

  constructor(data: BookingWithRelationsDto, type: BookingType) {
    super({
      code: HttpStatus.OK,
      message: `update ${type.toLowerCase()} booking success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
