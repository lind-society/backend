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
} from 'class-validator';
import { ValidateDiscountValue } from 'src/common/decorators';
import { DefaultHttpStatus } from 'src/common/enums';
import { DiscountType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FeatureWithRelationsDto } from './feature.dto';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  readonly type!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsBoolean()
  @IsOptional()
  readonly free?: boolean | null;

  @IsUUID()
  @IsOptional()
  readonly currencyId?: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price must be a valid number' },
  )
  @Min(0, { message: 'minimum price is 0' })
  @IsOptional()
  readonly price?: number | null;

  @IsEnum(DiscountType)
  @IsOptional()
  readonly discountType?: DiscountType | null;

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
  readonly discount?: number | null;
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
