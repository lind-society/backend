import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { BookingWithRelationsDto } from './booking.dto';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  /**
   * Why a negotiation ended without a booking. Surfaced to the customer in the
   * closing WhatsApp message, since their link stops working right after.
   */
  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly closedReason?: string;
}

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
