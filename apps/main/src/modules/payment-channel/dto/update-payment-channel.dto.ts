import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaymentChannelDto } from './payment-channel.dto';

export class UpdatePaymentChannelDto {
  @IsString()
  @IsNotEmpty()
  readonly code!: string;
}

export class UpdatePaymentChannelBulkDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly code!: string;
}

export class UpdatePaymentChannelSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentChannelDto>
{
  readonly data: PaymentChannelDto;

  constructor(data: PaymentChannelDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update payment channel success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class UpdatePaymentChannelBulkSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentChannelDto[]>
{
  readonly data: PaymentChannelDto[];

  constructor(data: PaymentChannelDto[]) {
    super({
      code: HttpStatus.CREATED,
      message: 'update payment channels success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
