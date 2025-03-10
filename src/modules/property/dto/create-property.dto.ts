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
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  PropertyOwnershipType,
  PropertyPlaceNearby,
} from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePropertyFacililtyDto } from './create-property-facility.dto';
import { PropertyWithRelationsDto } from './property.dto';

export class PropertyPlaceNearbyDto extends PropertyPlaceNearby {
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

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discount must be a valid number' },
  )
  @Min(1, { message: 'minimum discount is 1%' })
  @Max(100, { message: 'maximum discount is 100%' })
  @IsOptional()
  readonly discount?: number;

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
  @Type(() => PropertyPlaceNearbyDto)
  @IsOptional()
  readonly placeNearby?: PropertyPlaceNearbyDto[] | null;

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

  @IsString()
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
