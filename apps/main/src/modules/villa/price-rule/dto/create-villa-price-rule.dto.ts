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
import { Type } from 'class-transformer';
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
  Max,
  Min,
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

  @IsEnum(DiscountType, {
    message: `discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @IsOptional()
  discountType?: DiscountType;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discount must be a valid number' },
  )
  @Min(0, { message: 'minimum discount is 0' })
  @Max(100, { message: 'maximum discount is 100' })
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
