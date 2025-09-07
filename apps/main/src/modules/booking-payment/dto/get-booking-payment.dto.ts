import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PaymentDto,
  PaymentRequestDto,
  PaymentSessionDto,
  PaymentTokenDto,
} from '../../payment/dto';
import {
  BookingPaymentPaginationDto,
  BookingPaymentWithRelationsDto,
} from './booking-payment.dto';

export class GetBookingPaymentPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BookingPaymentPaginationDto[];
}

export class GetBookingPaymentsSuccessResponse
  extends HttpResponseDefaultProps
  implements
    HttpResponseOptions<
      GetBookingPaymentPaginateDto | BookingPaymentWithRelationsDto[]
    >
{
  readonly data:
    | GetBookingPaymentPaginateDto
    | BookingPaymentWithRelationsDto[];

  constructor(
    data: GetBookingPaymentPaginateDto | BookingPaymentWithRelationsDto[],
  ) {
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

export class GetMultipleBookingPaymentSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentWithRelationsDto[]>
{
  readonly data: BookingPaymentWithRelationsDto[];

  constructor(data: BookingPaymentWithRelationsDto[]) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payments from booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

// Dashboard related payment gateway action response
export class GetBookingPaymentRequestDetailSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentRequestDto>
{
  readonly data: PaymentRequestDto;

  constructor(data: PaymentRequestDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment request detail success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingPaymentSessionDetailSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentSessionDto>
{
  readonly data: PaymentSessionDto;

  constructor(data: PaymentSessionDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment session detail success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingPaymentDetailSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentDto>
{
  readonly data: PaymentDto;

  constructor(data: PaymentDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment detail success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingPaymentTokenDetailSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentTokenDto>
{
  readonly data: PaymentTokenDto;

  constructor(data: PaymentTokenDto) {
    super({
      code: HttpStatus.OK,
      message: 'get booking payment token detail success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
