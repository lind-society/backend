import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePackageBenefitPivotDto } from './create-package-benefit-pivot.dto';
import { PackageWithRelationsDto } from './package.dto';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageBenefitPivotDto)
  @IsOptional()
  readonly benefits?: CreatePackageBenefitPivotDto[];
}

export class CreatePackageSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PackageWithRelationsDto>
{
  readonly data: PackageWithRelationsDto;

  constructor(data: PackageWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create package success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
