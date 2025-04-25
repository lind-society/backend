import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
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
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RegexValidator, ValidateDiscountValue } from 'src/common/decorators';
import { ValidateRequiredVillaPolicies } from 'src/common/decorators/validate-required-villa-policies.decorator';
import { DefaultHttpStatus } from 'src/common/enums';
import { DiscountType, VillaAvailability } from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from 'src/modules/shared/dto';
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
  @Min(0, { message: 'minimum daily base price is 0' })
  @IsOptional()
  readonly dailyBasePrice?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum low season price rate is 0' })
  @Max(100, { message: 'minimum low season price rate is 100' })
  @IsOptional()
  readonly lowSeasonPriceRate?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum high season price rate is 0' })
  @Max(100, { message: 'minimum high season price rate is 100' })
  @IsOptional()
  readonly highSeasonPriceRate?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum peak season price rate is 0' })
  @Max(100, { message: 'minimum peak season price rate is 100' })
  @IsOptional()
  readonly peakSeasonPriceRate?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum daily base price after season rate is 0' })
  @IsOptional()
  dailyBasePriceAfterSeasonRate?: number;

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

  @IsEnum(DiscountType)
  @IsOptional()
  discountMonthlyType?: DiscountType;

  @IsEnum(DiscountType)
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
  @ValidateDiscountValue('discountMonthlyType', 'priceMonthly', DiscountType)
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
  @ValidateDiscountValue('discountYearlyType', 'priceyearly', DiscountType)
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
  @ArrayMinSize(1, { message: 'at least 1 place nearby is required' })
  @ValidateNested({ each: true })
  @Type(() => PlaceNearbyDto)
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
  @ArrayMinSize(1, { message: 'at least 1 video is required' })
  @IsString({ each: true })
  readonly videos!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly video360s?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly floorPlans?: string[];

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
