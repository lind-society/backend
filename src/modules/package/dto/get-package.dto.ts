import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { PackageDto } from './package.dto';

export class GetPackagePaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: PackageDto[];
}

export class GetPackagesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetPackagePaginateDto>
{
  readonly data: GetPackagePaginateDto;

  constructor(data: GetPackagePaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get packages success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetPackageSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageDto>
{
  readonly data: PackageDto;

  constructor(data: PackageDto) {
    super({
      code: HttpStatus.OK,
      message: 'get package success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
