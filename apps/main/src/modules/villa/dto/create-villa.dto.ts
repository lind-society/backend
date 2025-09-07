import {
  RegexValidator,
  ValidateDiscountValue,
  ValidateRequiredVillaPolicies,
} from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import { DiscountType, VillaAvailability } from '@apps/main/database/entities';
import { CreateAdditionalDto } from '@apps/main/modules/additional/dto';
import { CreateFeatureDto } from '@apps/main/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateVillaPolicyDto } from '../policy/dto';
import { CreateVillaFacililtyPivotDto } from './create-villa-facility-pivot.dto';
import { VillaWithRelationsDto } from './villa.dto';

export class VillaAvailabilityDto extends VillaAvailability {
  @IsBoolean()
  @IsNotEmpty()
  daily!: boolean;

  @IsBoolean()
  @IsNotEmpty()
  monthly!: boolean;

  @IsBoolean()
  @IsNotEmpty()
  yearly!: boolean;
}

export class CreateVillaDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly secondaryName!: string;

  @ValidateNested()
  @Type(() => VillaAvailabilityDto)
  @IsNotEmpty()
  readonly availability!: VillaAvailabilityDto;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum daily price is 0' })
  @IsOptional()
  readonly dailyPrice?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum low season daily price is 0' })
  @IsOptional()
  readonly lowSeasonDailyPrice?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum high season daily price is 0' })
  @IsOptional()
  readonly highSeasonDailyPrice?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum peak season daily price is 0' })
  @IsOptional()
  readonly peakSeasonDailyPrice?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum daily price after discount is 0' })
  @IsOptional()
  dailyPriceAfterDiscount?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum low season daily price after discount is 0' })
  @IsOptional()
  lowSeasonDailyPriceAfterDiscount?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum high season daily price after discount is 0' })
  @IsOptional()
  highSeasonDailyPriceAfterDiscount?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum peak season daily price after discount is 0' })
  @IsOptional()
  peakSeasonDailyPriceAfterDiscount?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum monthly price is 0' })
  @IsOptional()
  readonly priceMonthly?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum yearly price is 0' })
  @IsOptional()
  readonly priceYearly?: number;

  @IsEnum(DiscountType, {
    message: `discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @Transform(({ obj }) => {
    if (
      obj.discountMonthly !== undefined &&
      obj.discountMonthly !== null &&
      !obj.discountMonthlyType
    ) {
      return DiscountType.Percentage;
    }

    return obj.discountMonthlyType;
  })
  @IsOptional()
  discountMonthlyType?: DiscountType;

  @IsEnum(DiscountType, {
    message: `discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @Transform(({ obj }) => {
    if (
      obj.discountyearly !== undefined &&
      obj.discountyearly !== null &&
      !obj.discountyearlyType
    ) {
      return DiscountType.Percentage;
    }

    return obj.discountyearlyType;
  })
  @IsOptional()
  discountYearlyType?: DiscountType;

  @ValidateIf(
    (o) =>
      o.discountMonthlyType !== null && o.discountMonthlyType !== undefined,
  )
  @IsNotEmpty({
    message:
      'discountMonthly should be provided when discountMonthlyType is filled',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discountMonthly must be a valid number' },
  )
  @ValidateDiscountValue('discountMonthlyType', 'priceMonthly')
  @IsOptional()
  readonly discountMonthly?: number;

  @ValidateIf(
    (o) => o.discountYearlyType !== null && o.discountYearlyType !== undefined,
  )
  @IsNotEmpty({
    message:
      'discountYearly should be provided when discountYearlyType is filled',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discountYearly must be a valid number' },
  )
  @ValidateDiscountValue('discountYearlyType', 'priceyearly')
  readonly discountYearly?: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'availabilityQuotaPerMonth must be a valid number' },
  )
  @Min(0, { message: 'minimum availabilityQuotaPerMonth is 0' })
  @IsOptional()
  readonly availabilityQuotaPerMonth?: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'availabilityQuotaPerYear must be a valid number' },
  )
  @Min(0, { message: 'minimum availabilityQuotaPerYear is 0' })
  @IsOptional()
  readonly availabilityQuotaPerYear?: number;

  @IsString()
  @IsNotEmpty()
  readonly highlight!: string;

  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @IsString()
  @IsNotEmpty()
  readonly country!: string;

  @IsString()
  @IsNotEmpty()
  readonly state!: string;

  @IsString()
  @IsNotEmpty()
  readonly city!: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly postalCode!: string;

  @IsString()
  @IsNotEmpty()
  readonly mapLink!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceNearbyDto)
  @IsOptional()
  readonly placeNearby!: PlaceNearbyDto[];

  @IsString()
  @RegexValidator('checkInHour')
  @IsNotEmpty()
  readonly checkInHour!: string;

  @IsString()
  @RegexValidator('checkOutHour')
  @IsNotEmpty()
  readonly checkOutHour!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 photo is required' })
  @IsString({ each: true })
  readonly photos!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly videos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly video360s?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly floorPlans?: string[];

  @IsBoolean()
  @IsOptional()
  readonly isFavorite?: boolean;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly ownerId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 facility is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateVillaFacililtyPivotDto)
  readonly facilities!: CreateVillaFacililtyPivotDto[];

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 additional is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateAdditionalDto)
  @IsOptional()
  readonly additionals!: CreateAdditionalDto[];

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 feature is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  @IsOptional()
  readonly features!: CreateFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVillaPolicyDto)
  @ValidateRequiredVillaPolicies()
  @IsNotEmpty()
  readonly policies!: CreateVillaPolicyDto[];
}

export class CreateVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithRelationsDto>
{
  readonly data: VillaWithRelationsDto;

  constructor(data: VillaWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
