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
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { regexValidator } from 'src/common/constants';
import { ValidateDiscountValue } from 'src/common/decorators';
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
  readonly secondaryName?: string | null;

  @IsArray()
  @IsEnum(VillaAvailability, { each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  readonly availability?: VillaAvailability[] | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum daily price is 0' })
  @IsOptional()
  readonly priceDaily?: number | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum monthly price is 0' })
  @IsOptional()
  readonly priceMonthly?: number | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum yearly price is 0' })
  @IsOptional()
  readonly priceYearly?: number | null;

  @IsEnum(DiscountType)
  @IsOptional()
  discountDailyType?: DiscountType | null;

  @IsEnum(DiscountType)
  @IsOptional()
  discountMonthlyType?: DiscountType | null;

  @IsEnum(DiscountType)
  @IsOptional()
  discountYearlyType?: DiscountType | null;

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
  readonly discountDaily?: number | null;

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
  readonly discountMonthly?: number | null;

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
  readonly discountYearly?: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VillaAvailabilityPerPriceDto)
  @IsOptional()
  readonly availabilityPerPrice?: VillaAvailabilityPerPriceDto[] | null;

  @IsString()
  @IsOptional()
  readonly highlight?: string | null;

  @IsString()
  @IsOptional()
  readonly address?: string | null;

  @IsString()
  @IsOptional()
  readonly country?: string | null;

  @IsString()
  @IsOptional()
  readonly state?: string | null;

  @IsString()
  @IsOptional()
  readonly city?: string | null;

  @IsNumberString()
  @IsOptional()
  readonly postalCode?: string | null;

  @IsString()
  @IsOptional()
  readonly mapLink?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceNearbyDto)
  @IsOptional()
  readonly placeNearby?: PlaceNearbyDto[] | null;

  @IsString()
  @Matches(regexValidator.checkInHour.regex, {
    message: regexValidator.checkInHour.message,
  })
  @IsNotEmpty()
  readonly checkInHour!: string;

  @IsString()
  @Matches(regexValidator.checkOutHour.regex, {
    message: regexValidator.checkOutHour.message,
  })
  @IsNotEmpty()
  readonly checkOutHour!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly photos?: string[] | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly videos?: string[] | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly video360s?: string[] | null;

  @IsUUID()
  @IsOptional()
  readonly currencyId?: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVillaFacililtyDto)
  @IsOptional()
  readonly facilities?: CreateVillaFacililtyDto[] | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdditionalDto)
  @IsOptional()
  readonly additionals?: CreateAdditionalDto[] | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  @IsOptional()
  readonly features?: CreateFeatureDto[] | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVillaPolicyDto)
  @IsOptional()
  readonly policies?: CreateVillaPolicyDto[] | null;
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
