import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { PackageBenefitDto } from './package-benefit.dto';

export class GetPackageBenefitPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: PackageBenefitDto[];
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
  implements HttpResponseOptions<PackageBenefitDto>
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
