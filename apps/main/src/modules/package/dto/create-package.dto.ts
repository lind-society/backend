import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreatePackageBenefitPivotDto } from './create-package-benefit-pivot.dto';
import { PackageWithRelationsDto } from './package.dto';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  /** e.g. 8 = "8% of rental revenue". Shown on the public pricing page. */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly commissionPercentage?: number;

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
