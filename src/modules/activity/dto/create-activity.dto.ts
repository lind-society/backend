import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
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
import {
  RegexValidator,
  ValidateDiscountValueFromMultiplePrice,
} from 'src/common/decorators';
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
  @IsNotEmpty()
  readonly secondaryName!: string;

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
  @IsOptional()
  readonly startDate?: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsOptional()
  readonly endDate?: Date;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 photo is required' })
  @IsString({ each: true })
  readonly photos!: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'at least 1 video is required' })
  @IsString({ each: true })
  readonly videos!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly video360s?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly floorPlan?: string[];

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
