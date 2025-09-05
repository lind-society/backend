import {
  RegexValidator,
  ValidateDiscountValue,
} from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import { ActivityDuration, DiscountType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
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
import { ActivityWithRelationsDto } from './activity.dto';

export class CreateActivityDto {
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
  @IsNotEmpty()
  readonly price!: number;

  @IsEnum(DiscountType, {
    message: `discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @Transform(({ obj }) => {
    // Set default discountType to Percentage only if
    if (
      obj.discount !== undefined &&
      obj.discount !== null &&
      !obj.discountType
    ) {
      return DiscountType.Percentage;
    }

    return obj.discountType;
  })
  @IsOptional()
  discountType?: DiscountType;

  @ValidateIf((o) => o.discountType !== null && o.discountType !== undefined)
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

  @IsEnum(ActivityDuration, {
    message: `activity duration must be one of: ${Object.values(ActivityDuration).join(', ')}`,
  })
  @IsNotEmpty()
  readonly duration!: ActivityDuration;

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
  @ValidateNested({ each: true })
  @Type(() => PlaceNearbyDto)
  @IsOptional()
  readonly placeNearby!: PlaceNearbyDto[];

  @IsString()
  @RegexValidator('openingHour')
  @IsNotEmpty()
  readonly openingHour!: string;

  @IsString()
  @RegexValidator('closingHour')
  @IsNotEmpty()
  readonly closingHour!: string;

  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsNotEmpty()
  readonly startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsNotEmpty()
  readonly endDate!: Date;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'daily limit must be a valid number' },
  )
  @Min(0, { message: 'minimum daily limit is 0' })
  @IsNotEmpty()
  readonly dailyLimit!: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 photo is required' })
  @IsString({ each: true })
  readonly photos!: string[];

  @IsArray()
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
  readonly floorPlans?: string[];

  @IsBoolean()
  @IsOptional()
  readonly isFavorite?: boolean;

  @IsUUID()
  @IsNotEmpty()
  readonly categoryId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly ownerId!: string;
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
