import { ValidateDiscountValue } from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import { DiscountType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  IconDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FeatureWithRelationsDto } from './feature.dto';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  readonly type!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ValidateNested()
  @Type(() => IconDto)
  @IsOptional()
  readonly icon?: IconDto;

  @IsBoolean()
  @IsOptional()
  readonly free?: boolean;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price must be a valid number' },
  )
  @Min(0, { message: 'minimum price is 0' })
  @IsOptional()
  readonly price?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @ValidateIf((o) => o.discountType !== null && o.discountType !== undefined)
  @IsNotEmpty({
    message: 'discount should be provided when discountType is filled',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discount must be a valid number' },
  )
  @ValidateDiscountValue('discountType', 'price', DiscountType)
  @IsOptional()
  readonly discount?: number;
}

export class CreateFeatureSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FeatureWithRelationsDto>
{
  readonly data: FeatureWithRelationsDto;

  constructor(data: FeatureWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create feature success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
