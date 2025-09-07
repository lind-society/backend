import { DefaultHttpStatus } from '@apps/main/common/enums';
import { PaymentChannelType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentChannelDto } from './payment-channel.dto';

export class CreatePaymentChannelDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @IsEnum(PaymentChannelType, {
    message: `payment channel type must be one of: ${Object.values(PaymentChannelType).join(', ')}`,
  })
  @IsOptional()
  readonly type?: PaymentChannelType;

  @IsString()
  @IsOptional()
  readonly description?: string;
}

export class CreatePaymentChannelSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentChannelDto>
{
  readonly data: PaymentChannelDto;

  constructor(data: PaymentChannelDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create payment channel success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
