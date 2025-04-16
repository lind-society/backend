import {
  RegexValidator,
  ValidateDiscountValueFromMultiplePrice,
} from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import { ActivityDuration, DiscountType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from '@apps/main/modules/shared/dto';
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
  @IsOptional()
  readonly secondaryName?: string;

  @IsString()
  @IsOptional()
  readonly highlight?: string;

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

  @IsEnum(DiscountType)
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
  @ValidateDiscountValueFromMultiplePrice(
    'discountType',
    ['pricePerPerson', 'pricePerSession'],
    DiscountType,
  )
  @IsOptional()
  readonly discount?: number;

  @IsEnum(ActivityDuration, {
    message: `activity duration must be one of: ${Object.values(ActivityDuration).join(', ')}`,
  })
  @IsNotEmpty()
  readonly duration?: ActivityDuration;

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

  @IsString()
  @RegexValidator('openingHour')
  @IsNotEmpty()
  readonly openingHour?: string;

  @IsString()
  @RegexValidator('closingHour')
  @IsNotEmpty()
  readonly closingHour?: string;

  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsOptional()
  readonly startDate?: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsOptional()
  readonly endDate?: Date;

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

  @IsUUID()
  @IsNotEmpty()
  readonly categoryId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly ownerId?: string;
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
