import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePackageDto } from './create-package.dto';
import { PackageWithRelationsDto } from './package.dto';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

export class UpdatePackageSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageWithRelationsDto>
{
  readonly data: PackageWithRelationsDto;

  constructor(data: PackageWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update package success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
