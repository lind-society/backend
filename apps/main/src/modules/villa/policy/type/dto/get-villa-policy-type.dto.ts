import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  VillaPolicyTypeDto,
  VillaPolicyTypePaginationDto,
} from './villa-policy-type.dto';

export class GetVillaPolicyPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaPolicyTypePaginationDto[];
}

export class GetVillaPolicyTypesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaPolicyPaginateDto>
{
  readonly data: GetVillaPolicyPaginateDto;

  constructor(data: GetVillaPolicyPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa policy types success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaPolicyTypeSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyTypeDto>
{
  readonly data: VillaPolicyTypeDto;

  constructor(data: VillaPolicyTypeDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa policy type success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
