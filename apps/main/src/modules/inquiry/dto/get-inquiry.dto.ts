import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { InquiryDto } from './inquiry.dto';

export class GetInquiryPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: InquiryDto[];
}

export class GetInquiriesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetInquiryPaginateDto>
{
  readonly data: GetInquiryPaginateDto;

  constructor(data: GetInquiryPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get inquiries success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetInquirySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<InquiryDto>
{
  readonly data: InquiryDto;

  constructor(data: InquiryDto) {
    super({
      code: HttpStatus.OK,
      message: 'get inquiry success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
