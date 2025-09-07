import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PaymentChannelDto,
  PaymentChannelPaginationDto,
} from './payment-channel.dto';

export class GetPaymentChannelPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: PaymentChannelPaginationDto[];
}

export class GetPaymentChannelsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetPaymentChannelPaginateDto>
{
  readonly data: GetPaymentChannelPaginateDto;

  constructor(data: GetPaymentChannelPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get payment channels success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetPaymentChannelSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentChannelDto>
{
  readonly data: PaymentChannelDto;

  constructor(data: PaymentChannelDto) {
    super({
      code: HttpStatus.OK,
      message: 'get payment channel success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
