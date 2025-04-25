import { Transform, Type } from 'class-transformer';
import {
  Activity,
  ActivityDuration,
  DiscountType,
  PlaceNearby,
} from 'src/database/entities';
import { BookingDto } from 'src/modules/booking/dto';
import { CurrencyDto } from 'src/modules/currency/dto';
import { OwnerDto } from 'src/modules/owner/dto';
import { ReviewDto } from 'src/modules/review/dto';
import { ActivityCategoryDto } from '../category/dto';

export interface IActivityDto
  extends Omit<
    Activity,
    'category' | 'currency' | 'owner' | 'bookings' | 'reviews'
  > {}

export interface IActivityWithRelationsDto extends IActivityDto {
  category?: ActivityCategoryDto;
  currency?: CurrencyDto;
  owner?: OwnerDto;
  bookings?: BookingDto[];
  reviews?: ReviewDto[];
}

export class ActivityDto implements IActivityDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string;
  readonly pricePerPerson!: number | null;
  readonly pricePerSession!: number | null;
  readonly discountType!: DiscountType | null;
  readonly discount!: number | null;
  readonly pricePerPersonAfterDiscount!: number | null;
  readonly pricePerSessionAfterDiscount!: number | null;
  readonly duration!: ActivityDuration;
  readonly highlight!: string;
  readonly address!: string;
  readonly country!: string;
  readonly state!: string;
  readonly city!: string;
  readonly postalCode!: string;
  readonly mapLink!: string;
  readonly placeNearby!: PlaceNearby[];

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly openingHour!: string;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly closingHour!: string;

  readonly startDate!: Date | null;
  readonly endDate!: Date | null;
  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[] | null;
  readonly floorPlans!: string[] | null;
  readonly averageRating!: number | null;
  readonly categoryId!: string | null;
  readonly currencyId!: string | null;
  readonly ownerId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ActivityWithRelationsDto
  extends ActivityDto
  implements IActivityWithRelationsDto
{
  readonly category?: ActivityCategoryDto;
  readonly currency?: CurrencyDto;
  @Type(() => OwnerDto)
  readonly owner?: OwnerDto;
  readonly bookings?: BookingDto[];
  readonly reviews?: ReviewDto[];
}
