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
  @IsNotEmpty()
  readonly secondaryName!: string;

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

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 photo is required' })
  @IsString({ each: true })
  @IsOptional()
  readonly photos?: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 video is required' })
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
  readonly floorPlan?: string[];

  @IsBoolean()
  @IsNotEmpty()
  readonly soldStatus!: boolean;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly ownerId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 facility is required' })
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyFacililtyPivotDto)
  @IsOptional()
  readonly facilities!: CreatePropertyFacililtyPivotDto[];

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
