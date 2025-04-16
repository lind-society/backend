import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePackageBenefitDto } from './create-package-benefit.dto';
import { PackageBenefitWithRelationsDto } from './package-benefit.dto';

export class UpdatePackageBenefitDto extends PartialType(
  CreatePackageBenefitDto,
) {}

export class UpdatePackageBenefitSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageBenefitWithRelationsDto>
{
  readonly data: PackageBenefitWithRelationsDto;

  constructor(data: PackageBenefitWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update package benefit success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
