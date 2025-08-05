import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { BookingPaymentRefundWithRelationsDto } from './booking-payment-refund.dto';
import { CreateBookingPaymentRefundDto } from './create-booking-payment-refund.dto';

export class UpdateBookingPaymentRefundDto extends PartialType(
  CreateBookingPaymentRefundDto,
) {}

export class UpdateBookingPaymentRefundSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentRefundWithRelationsDto>
{
  readonly data: BookingPaymentRefundWithRelationsDto;

  constructor(data: BookingPaymentRefundWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update booking payment refund success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
