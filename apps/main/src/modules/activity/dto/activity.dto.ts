import {
  Activity,
  ActivityDuration,
  DiscountType,
  PlaceNearby,
} from '@apps/main/database/entities';
import { BookingDto } from '@apps/main/modules/booking/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { OwnerDto } from '@apps/main/modules/owner/dto';
import { ReviewDto } from '@apps/main/modules/review/dto';
import { Transform, Type } from 'class-transformer';
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
  readonly secondaryName!: string | null;
  readonly highlight!: string | null;
  readonly pricePerPerson!: number | null;
  readonly pricePerSession!: number | null;
  readonly discountType!: DiscountType | null;
  readonly discount!: number | null;
  readonly pricePerPersonAfterDiscount!: number | null;
  readonly pricePerSessionAfterDiscount!: number | null;
  readonly duration!: ActivityDuration;
  readonly address!: string | null;
  readonly country!: string | null;
  readonly state!: string | null;
  readonly city!: string | null;
  readonly postalCode!: string | null;
  readonly mapLink!: string | null;
  readonly placeNearby!: PlaceNearby[] | null;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly openingHour!: string;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly closingHour!: string;

  readonly startDate!: Date | null;
  readonly endDate!: Date | null;
  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[];
  readonly averageRating!: number | null;
  readonly categoryId!: string;
  readonly currencyId!: string;
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
