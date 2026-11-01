import { DefaultHttpStatus } from '@apps/main/common/enums';
import { InquiryStatus } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { InquiryDto } from './inquiry.dto';

export class UpdateInquiryDto {
  @IsEnum(InquiryStatus, {
    message: `inquiry status must be one of: ${Object.values(InquiryStatus).join(', ')}`,
  })
  readonly status!: InquiryStatus;
}

export class UpdateInquirySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<InquiryDto>
{
  readonly data: InquiryDto;

  constructor(data: InquiryDto) {
    super({
      code: HttpStatus.OK,
      message: 'update inquiry success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
