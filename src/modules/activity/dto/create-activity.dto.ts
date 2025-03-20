import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { regexValidator } from 'src/common/constants';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  ActivityDiscountType,
  ActivityDuration,
  ActivityPlaceNearby,
} from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ActivityWithRelationsDto } from './activity.dto';

export class ActivityPlaceNearbyDto extends ActivityPlaceNearby {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'distance must be a valid number' },
  )
  @Min(1, { message: 'minimum distance is 1' })
  @IsNotEmpty()
  distance!: number;
}

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly secondaryName?: string | null;

  @IsString()
  @IsOptional()
  readonly highlight?: string | null;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price per person must be a valid number' },
  )
  @Min(0, { message: 'minimum price per person is 0' })
  @IsOptional()
  readonly pricePerPerson?: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price per session must be a valid number' },
  )
  @Min(0, { message: 'minimum price per session is 0' })
  @IsOptional()
  readonly pricePerSession?: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'discount must be a valid number' },
  )
  @ValidateIf((o) => o.discountType === ActivityDiscountType.Percentage)
  @Min(0, { message: 'Percentage discount cannot be less than 0%' })
  @Max(100, { message: 'Percentage discount cannot exceed 100%' })
  @ValidateIf((o) => o.discountType === ActivityDiscountType.Fixed)
  @Min(0, { message: 'Fixed discount cannot be less than 0' })
  @ValidateIf(
    (o) =>
      o.discountType === ActivityDiscountType.Fixed &&
      o.pricePerSession !== undefined &&
      o.pricePerSession !== null &&
      o.discount > o.pricePerSession,
  )
  @Max(0, { message: 'Fixed discount cannot exceed the price' })
  @IsOptional()
  readonly discount?: number;

  @IsEnum(ActivityDuration, {
    message: `activity duration must be one of: ${Object.values(ActivityDuration).join(', ')}`,
  })
  @IsNotEmpty()
  readonly duration?: ActivityDuration;

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
  @Type(() => ActivityPlaceNearbyDto)
  @IsOptional()
  readonly placeNearby?: ActivityPlaceNearbyDto[] | null;

  @IsString()
  @Matches(regexValidator.openingHour.regex, {
    message: regexValidator.openingHour.message,
  })
  @IsNotEmpty()
  readonly openingHour?: string | null;

  @IsString()
  @Matches(regexValidator.closingHour.regex, {
    message: regexValidator.closingHour.message,
  })
  @IsNotEmpty()
  readonly closingHour?: string | null;

  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsOptional()
  readonly startDate?: Date | null;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsOptional()
  readonly endDate?: Date | null;

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
  @IsNotEmpty()
  readonly categoryId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId?: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string | null;
}

export class CreateActivitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityWithRelationsDto>
{
  readonly data: ActivityWithRelationsDto;

  constructor(data: ActivityWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create activity success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
