import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePaymentChannelDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly ids!: string[];
}

export class DeletePaymentChannelSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<DeletePaymentChannelDto>
{
  readonly data: DeletePaymentChannelDto;

  constructor(data: DeletePaymentChannelDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'delete payment channels success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
