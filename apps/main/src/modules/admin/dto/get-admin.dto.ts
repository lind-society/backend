import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { AdminPaginationDto, AdminPayloadDto } from './admin.dto';

export class GetAdminsPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: AdminPaginationDto[];
}

export class GetAdminsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetAdminsPaginateDto>
{
  readonly data: GetAdminsPaginateDto;

  constructor(data: GetAdminsPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get admins success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetAdminSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminPayloadDto>
{
  readonly data: AdminPayloadDto;

  constructor(data: AdminPayloadDto) {
    super({
      code: HttpStatus.OK,
      message: 'get admin success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class ViewProfileSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminPayloadDto>
{
  readonly data: AdminPayloadDto;

  constructor(data: AdminPayloadDto) {
    super({
      code: HttpStatus.OK,
      message: 'view profile success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
