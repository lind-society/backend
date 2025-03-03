import { HttpStatus } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
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
import { UpdateAdditionalDto } from 'src/modules/additional/dto';
import { UpdateFeatureDto } from 'src/modules/feature/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePropertyDto } from './create-property.dto';
import { PropertyWithRelationsDto } from './property.dto';
import { UpdatePropertyFacililtyDto } from './update-property-facility.dto';

export class UpdatePropertyDto extends PartialType(
  OmitType(CreatePropertyDto, ['additionals', 'features'] as const),
) {
  @IsString()
  @IsOptional()
  readonly name?: string;

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
  @IsOptional()
  readonly ownershipType?: OwnershipType;

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
  @Type(() => UpdatePropertyFacililtyDto)
  @IsOptional()
  readonly facilites?: UpdatePropertyFacililtyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAdditionalDto)
  @IsOptional()
  readonly additionals?: UpdateAdditionalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFeatureDto)
  @IsOptional()
  readonly features?: UpdateFeatureDto[];
}

export class UpdatePropertySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PropertyWithRelationsDto>
{
  readonly data: PropertyWithRelationsDto;

  constructor(data: PropertyWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update property success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
