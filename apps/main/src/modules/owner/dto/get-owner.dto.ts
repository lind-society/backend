import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { OwnerPaginationDto, OwnerWithRelationsDto } from './owner.dto';

export class GetOwnersPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: OwnerPaginationDto[];
}

export class GetOwnersSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetOwnersPaginateDto>
{
  readonly data: GetOwnersPaginateDto;

  constructor(data: GetOwnersPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get owners success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetOwnerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<OwnerWithRelationsDto>
{
  readonly data: OwnerWithRelationsDto;

  constructor(data: OwnerWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get owner success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
