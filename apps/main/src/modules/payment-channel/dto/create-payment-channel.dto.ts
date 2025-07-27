import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PaymentChannelDto } from './payment-channel.dto';

export class CreatePaymentChannelDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  readonly codes!: string[];
}

export class CreatePaymentChannelSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentChannelDto[]>
{
  readonly data: PaymentChannelDto[];

  constructor(data: PaymentChannelDto[]) {
    super({
      code: HttpStatus.CREATED,
      message: 'create payment channels success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
