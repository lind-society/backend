import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  VillaAvailability,
  VillaAvailabilityPerPrice,
  VillaOwnershipType,
  VillaPlaceNearby,
} from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateVillaPolicyDto } from '../policy/dto';
import { CreateVillaFacililtyDto } from './create-villa-facility.dto';
import { VillaWithRelationsDto } from './villa.dto';

export class VillaPlaceNearbyDto extends VillaPlaceNearby {
  @IsString()
  @IsOptional()
  name: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'distance must be a valid number' },
  )
  @Min(1, { message: 'minimum distance is 1' })
  @IsOptional()
  distance: number | null;
}

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

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'minimum daily discount is 1%' })
  @Max(100, { message: 'maximum daily discount is 100%' })
  @IsOptional()
  readonly discountDaily?: number | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'minimum monthly discount is 1%' })
  @Max(100, { message: 'maximum monthly discount is 100%' })
  @IsOptional()
  readonly discountMonthly?: number | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'minimum yearly discount is 1%' })
  @Max(100, { message: 'maximum yearly discount is 100%' })
  @IsOptional()
  readonly discountYearly?: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VillaAvailabilityPerPriceDto)
  @IsOptional()
  readonly availabilityPerPrice?: VillaAvailabilityPerPriceDto[] | null;

  @IsEnum(VillaOwnershipType)
  @IsNotEmpty()
  readonly ownershipType!: VillaOwnershipType;

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
  @Type(() => VillaPlaceNearbyDto)
  @IsOptional()
  readonly placeNearby?: VillaPlaceNearbyDto[] | null;

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

  @IsBoolean()
  @IsNotEmpty()
  readonly soldStatus!: boolean;

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
