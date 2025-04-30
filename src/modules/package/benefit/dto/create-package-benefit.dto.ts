import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { PackageBenefitWithRelationsDto } from './package-benefit.dto';
import { IsNotEmpty, IsString } from 'class-validator';

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
