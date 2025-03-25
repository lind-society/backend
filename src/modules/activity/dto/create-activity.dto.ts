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
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { regexValidator } from 'src/common/constants';
import { ValidateDiscountValueFromMultiplePrice } from 'src/common/decorators';
import { DefaultHttpStatus } from 'src/common/enums';
import { ActivityDuration, DiscountType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PlaceNearbyDto,
} from 'src/modules/shared/dto';
import { ActivityWithRelationsDto } from './activity.dto';

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

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType | null;

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
  readonly currencyId!: string;

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
