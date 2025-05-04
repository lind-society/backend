import { Transform } from 'class-transformer';
import {
  Activity,
  ActivityDuration,
  DiscountType,
  PlaceNearby,
} from 'src/database/entities';
import { ActivityBookingDto } from 'src/modules/booking/activity-booking/dto';
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
  bookings?: ActivityBookingDto[];
  reviews?: ReviewDto[];
}

export class ActivityDto implements IActivityDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string;
  readonly price!: number;
  readonly discountType!: DiscountType | null;
  readonly discount!: number | null;
  readonly priceAfterDiscount!: number;
  readonly duration!: ActivityDuration;
  readonly highlight!: string;
  readonly address!: string;
  readonly country!: string;
  readonly state!: string;
  readonly city!: string;
  readonly postalCode!: string;
  readonly mapLink!: string;
  readonly placeNearby!: PlaceNearby[] | null;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly openingHour!: string;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly closingHour!: string;

  readonly startDate!: Date | null;
  readonly endDate!: Date | null;
  readonly dailyLimit!: number;
  todayBooking?: number | null;
  readonly photos!: string[];
  readonly videos!: string[] | null;
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
  readonly owner?: OwnerDto;
  readonly bookings?: ActivityBookingDto[];
  readonly reviews?: ReviewDto[];
}
