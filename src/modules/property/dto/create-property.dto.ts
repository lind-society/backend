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
import { CreatePropertyFacililtyPivotDto } from './create-property-facility-pivot.dto';
import { PropertyWithRelationsDto } from './property.dto';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly secondaryName?: string;

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
  discountType?: DiscountType;

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
  readonly discount?: number;

  @IsEnum(PropertyOwnershipType)
  @IsNotEmpty()
  readonly ownershipType!: PropertyOwnershipType;

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

  @IsBoolean()
  @IsNotEmpty()
  readonly soldStatus!: boolean;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyFacililtyPivotDto)
  @IsOptional()
  readonly facilities?: CreatePropertyFacililtyPivotDto[];

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
