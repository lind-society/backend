import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { OwnershipType } from 'src/database/entities';
import { CreateAdditionalDto } from 'src/modules/additional/dto';
import { CreateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePropertyFacililtyDto } from './create-property-facility.dto';
import { PropertyWithRelationsDto } from './property.dto';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @IsString()
  @IsOptional()
  readonly location?: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'areaSize must be a valid number' },
  )
  @Min(0, { message: 'areaSize must be at least 0' })
  @IsOptional()
  readonly areaSize?: number;

  @IsEnum(OwnershipType)
  @IsNotEmpty()
  readonly ownershipType!: OwnershipType;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price must be a valid number' },
  )
  @Min(0, { message: 'price must be at least 0' })
  @IsOptional()
  readonly price?: number;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly placeNearby?: string[] | null;

  @IsString()
  @IsOptional()
  readonly postalCode?: string | null;

  @IsString()
  @IsOptional()
  readonly mapLink?: string | null;

  @IsBoolean()
  @IsNotEmpty()
  readonly soldStatus!: boolean;

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
