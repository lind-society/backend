import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
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
import { ValidateDiscountValue } from 'src/common/decorators';
import { DefaultHttpStatus } from 'src/common/enums';
import { DiscountType, PropertyOwnershipType } from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from 'src/modules/shared/dto';
import { CreatePropertyFacililtyDto } from './create-property-facility.dto';
import { PropertyWithRelationsDto } from './property.dto';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly secondaryName?: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price must be a valid number' },
  )
  @Min(0, { message: 'minimum price is 0' })
  @IsOptional()
  readonly price?: number;

  @IsEnum(DiscountType, {
    message: `discount type be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @IsOptional()
  discountType?: DiscountType | null;

  @ValidateIf((o) => o.discountType !== null)
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

  @IsEnum(PropertyOwnershipType)
  @IsNotEmpty()
  readonly ownershipType!: PropertyOwnershipType;

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
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyFacililtyDto)
  @IsOptional()
  readonly facilities?: CreatePropertyFacililtyDto[] | null;

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
}

export class CreatePropertySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PropertyWithRelationsDto>
{
  readonly data: PropertyWithRelationsDto;

  constructor(data: PropertyWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create property success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
