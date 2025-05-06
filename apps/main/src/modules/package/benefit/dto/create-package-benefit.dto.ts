import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { PackageBenefitWithRelationsDto } from './package-benefit.dto';

export class CreatePackageBenefitDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;
}

export class CreatePackageBenefitSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageBenefitWithRelationsDto>
{
  readonly data: PackageBenefitWithRelationsDto;

  constructor(data: PackageBenefitWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create package benefit success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
