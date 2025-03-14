import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { OwnerWithRelationDto } from './owner.dto';

export class GetOwnersPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: OwnerWithRelationDto[];
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
  implements HttpResponseOptions<OwnerWithRelationDto>
{
  readonly data: OwnerWithRelationDto;

  constructor(data: OwnerWithRelationDto) {
    super({
      code: HttpStatus.OK,
      message: 'get owner success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class ViewProfileSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<OwnerWithRelationDto>
{
  readonly data: OwnerWithRelationDto;

  constructor(data: OwnerWithRelationDto) {
    super({
      code: HttpStatus.OK,
      message: 'view profile success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
