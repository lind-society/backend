import { ValidateDiscountValueWithoutPrice } from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  DiscountType,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { VillaPriceRuleWithRelationsDto } from './villa-price-rule.dto';

export class CreateVillaPriceRuleDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsNotEmpty()
  readonly startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsNotEmpty()
  readonly endDate!: Date;

  @IsEnum(VillaPriceRuleSeason, {
    message: `villa price rule season type must be one of: ${Object.values(VillaPriceRuleSeason).join(', ')}`,
  })
  @IsNotEmpty()
  readonly season!: VillaPriceRuleSeason;

  @IsBoolean()
  @IsNotEmpty()
  readonly isDiscount!: boolean;

  @Expose()
  @IsEnum(DiscountType, {
    message: `discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @Transform(({ obj }) => {
    if (
      obj.discount !== undefined &&
      obj.discount !== null &&
      !obj.discountType
    ) {
      return DiscountType.Percentage;
    }

    return obj.discountType;
  })
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
  @ValidateDiscountValueWithoutPrice('discountType')
  @IsOptional()
  readonly discount?: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly isActive!: boolean;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  readonly villaIds?: string[];

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;
}

export class CreateVillaPriceRuleSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPriceRuleWithRelationsDto>
{
  readonly data: VillaPriceRuleWithRelationsDto;

  constructor(data: VillaPriceRuleWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create villa price rule success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
