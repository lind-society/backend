import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import {
  PackageBenefitDto,
  PackageBenefitPaginationDto,
  PackageBenefitWithRelationsDto,
} from './package-benefit.dto';

export class GetPackageBenefitPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: PackageBenefitPaginationDto[];
}

export class GetPackageBenefitsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetPackageBenefitPaginateDto>
{
  readonly data: GetPackageBenefitPaginateDto;

  constructor(data: GetPackageBenefitPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get package benefits success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetPackageBenefitSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageBenefitWithRelationsDto>
{
  readonly data: PackageBenefitDto;

  constructor(data: PackageBenefitDto) {
    super({
      code: HttpStatus.OK,
      message: 'get package benefit success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
