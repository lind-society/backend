import {
  DiscountType,
  PlaceNearby,
  Villa,
  VillaAdditionalPivot,
  VillaAvailability,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaPolicyPivot,
  VillaPriceRulePivot,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import { VillaBookingDto } from '@apps/main/modules/booking/villa-booking/dto';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { OwnerDto } from '@apps/main/modules/owner/dto';
import { ReviewDto } from '@apps/main/modules/review/dto';
import { Transform, Type } from 'class-transformer';

export interface IVillaDto
  extends Omit<
    Villa,
    | 'currency'
    | 'owner'
    | 'villaFacilities'
    | 'villaFeatures'
    | 'villaAdditionals'
    | 'villaPolicies'
    | 'villaPriceRules'
    | 'bookings'
    | 'reviews'
  > {}

export interface IVillaWithRelationsDto extends IVillaDto {
  currency?: CurrencyDto;
  owner?: OwnerDto;
  bookings?: VillaBookingDto[];
  reviews?: ReviewDto[];
  additionals?: VillaAdditionalPivot[];
  facilities?: VillaFacilityPivot[];
  features?: VillaFeaturePivot[];
  policies?: VillaPolicyPivot[];
  priceRules?: VillaPriceRulePivot[];
}

export interface ICurrentVillaPrices {
  currentSeason: VillaPriceRuleSeason;
  currentIsDiscount: boolean;
  currentDiscountType?: DiscountType;
  currentDiscount?: number;
  currentDailyPrice?: number;
  currentDailyPriceAfterDiscount?: number;
  currencyId: string;
  currency?: CurrencyDto;
}

export class VillaDto implements IVillaDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string;
  readonly availability!: VillaAvailability;
  readonly dailyPrice!: number | null;
  readonly lowSeasonDailyPrice!: number | null;
  readonly highSeasonDailyPrice!: number | null;
  readonly peakSeasonDailyPrice!: number | null;
  dailyPriceAfterDiscount!: number | null;
  lowSeasonDailyPriceAfterDiscount!: number | null;
  highSeasonDailyPriceAfterDiscount!: number | null;
  peakSeasonDailyPriceAfterDiscount!: number | null;
  readonly priceMonthly!: number | null;
  readonly priceYearly!: number | null;
  readonly discountMonthlyType!: DiscountType | null;
  readonly discountYearlyType!: DiscountType | null;
  readonly discountMonthly!: number | null;
  readonly discountYearly!: number | null;
  readonly priceMonthlyAfterDiscount!: number | null;
  readonly priceYearlyAfterDiscount!: number | null;
  readonly availabilityQuotaPerMonth!: number | null;
  readonly availabilityQuotaPerYear!: number | null;
  readonly highlight!: string;
  readonly address!: string;
  readonly country!: string;
  readonly state!: string;
  readonly city!: string;
  readonly postalCode!: string;
  readonly mapLink!: string;
  readonly placeNearby!: PlaceNearby[] | null;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly checkInHour!: string;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly checkOutHour!: string;

  readonly photos!: string[];
  readonly videos!: string[] | null;
  readonly video360s!: string[] | null;
  readonly floorPlans!: string[] | null;
  readonly averageRating!: number | null;
  readonly currencyId!: string | null;
  readonly ownerId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;

  currentPrice?: ICurrentVillaPrices | null;
}

export class VillaWithRelationsDto
  extends VillaDto
  implements IVillaWithRelationsDto
{
  readonly currency?: CurrencyDto;
  @Type(() => OwnerDto)
  readonly owner?: OwnerDto;
  readonly bookings?: VillaBookingDto[];
  readonly reviews?: ReviewDto[];
  readonly additionals?: VillaAdditionalPivot[];
  readonly facilities?: VillaFacilityPivot[];
  readonly features?: VillaFeaturePivot[];
  readonly policies?: VillaPolicyPivot[];
  readonly priceRules?: VillaPriceRulePivot[];
}
