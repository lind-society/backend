import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { BookingPaymentRefundWithRelationsDto } from './booking-payment-refund.dto';

export class GetBookingPaymentRefundPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BookingPaymentRefundWithRelationsDto[];
}

export class GetBookingPaymentRefundsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBookingPaymentRefundPaginateDto>
{
  readonly data: GetBookingPaymentRefundPaginateDto;

  constructor(data: GetBookingPaymentRefundPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment refunds success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingPaymentRefundSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentRefundWithRelationsDto>
{
  readonly data: BookingPaymentRefundWithRelationsDto;

  constructor(data: BookingPaymentRefundWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment refund success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetMultipleBookingPaymentRefundSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentRefundWithRelationsDto[]>
{
  readonly data: BookingPaymentRefundWithRelationsDto[];

  constructor(data: BookingPaymentRefundWithRelationsDto[]) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment refunds from booking payment success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
