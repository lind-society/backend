import { Transform, Type } from 'class-transformer';
import {
  DiscountType,
  PlaceNearby,
  Villa,
  VillaAdditionalPivot,
  VillaAvailability,
  VillaFacilityPivot,
  VillaFeaturePivot,
} from 'src/database/entities';
import { VillaPolicyPivot } from 'src/database/entities/villa-policy-pivot.entity';
import { VillaPriceRulePivot } from 'src/database/entities/villa-price-rule-pivot.entity';
import { CurrencyDto } from 'src/modules/currency/dto';
import { OwnerDto } from 'src/modules/owner/dto';
import { ReviewDto } from 'src/modules/review/dto';
import { VillaBookingDto } from 'src/modules/villa/booking/dto';

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

export class VillaDto implements IVillaDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string;
  readonly availability!: VillaAvailability;
  readonly dailyBasePrice!: number | null;
  readonly lowSeasonPriceRate!: number | null;
  readonly highSeasonPriceRate!: number | null;
  readonly peakSeasonPriceRate!: number | null;
  readonly dailyBasePriceAfterSeasonRate!: number | null;
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
