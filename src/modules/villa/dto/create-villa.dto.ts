import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
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
import { RegexValidator, ValidateDiscountValue } from 'src/common/decorators';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  DiscountType,
  VillaAvailability,
  VillaAvailabilityPerPrice,
} from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from 'src/modules/shared/dto';
import { CreateVillaPolicyDto } from '../policy/dto';
import { CreateVillaFacililtyDto } from './create-villa-facility.dto';
import { VillaWithRelationsDto } from './villa.dto';

export class VillaAvailabilityPerPriceDto extends VillaAvailabilityPerPrice {
  @IsEnum(VillaAvailability)
  @IsNotEmpty()
  availability!: VillaAvailability;

  @IsInt()
  @Min(0, { message: 'minimum quota in villa availability per price is 0' })
  @IsNotEmpty()
  quota!: number;
}

export class CreateVillaDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly secondaryName?: string;

  @IsArray()
  @IsEnum(VillaAvailability, { each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  readonly availability?: VillaAvailability[];

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum daily price is 0' })
  @IsOptional()
  readonly priceDaily?: number;

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
  discountDailyType?: DiscountType;

  @IsEnum(DiscountType)
  @IsOptional()
  discountMonthlyType?: DiscountType;

  @IsEnum(DiscountType)
  @IsOptional()
  discountYearlyType?: DiscountType;

  @ValidateIf(
    (o) => o.discountDailyType !== null && o.discountDailyType !== undefined,
  )
  @IsNotEmpty({
    message:
      'discountDaily should be provided when discountDailyType is filled',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discountDaily must be a valid number' },
  )
  @ValidateDiscountValue('discountDailyType', 'priceDaily', DiscountType)
  @IsOptional()
  readonly discountDaily?: number;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VillaAvailabilityPerPriceDto)
  @IsOptional()
  readonly availabilityPerPrice?: VillaAvailabilityPerPriceDto[];

  @IsString()
  @IsOptional()
  readonly highlight?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly country?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  readonly city?: string;

  @IsNumberString()
  @IsOptional()
  readonly postalCode?: string;

  @IsString()
  @IsOptional()
  readonly mapLink?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceNearbyDto)
  @IsOptional()
  readonly placeNearby?: PlaceNearbyDto[];

  @IsString()
  @RegexValidator('checkInHour')
  @IsNotEmpty()
  readonly checkInHour!: string;

  @IsString()
  @RegexValidator('checkOutHour')
  @IsNotEmpty()
  readonly checkOutHour!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly photos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly videos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly video360s?: string[];

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVillaFacililtyDto)
  @IsOptional()
  readonly facilities?: CreateVillaFacililtyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdditionalDto)
  @IsOptional()
  readonly additionals?: CreateAdditionalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  @IsOptional()
  readonly features?: CreateFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVillaPolicyDto)
  @IsOptional()
  readonly policies?: CreateVillaPolicyDto[];
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
