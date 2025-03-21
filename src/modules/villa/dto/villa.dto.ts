import { Transform } from 'class-transformer';
import {
  DiscountType,
  PlaceNearby,
  Villa,
  VillaAdditionalPivot,
  VillaAvailability,
  VillaAvailabilityPerPrice,
  VillaFacilityPivot,
  VillaFeaturePivot,
} from 'src/database/entities';
import { VillaPolicyPivot } from 'src/database/entities/villa-policy-pivot.entity';
import { CurrencyDto } from 'src/modules/currency/dto';
import { OwnerDto } from 'src/modules/owner/dto';
import { ReviewDto } from 'src/modules/review/dto';

export interface IVillaDto
  extends Omit<
    Villa,
    | 'currency'
    | 'owner'
    | 'villaFacilities'
    | 'villaFeatures'
    | 'villaAdditionals'
    | 'villaPolicies'
    | 'reviews'
  > {}

export interface IVillaWithRelationsDto extends IVillaDto {
  currency?: CurrencyDto;
  owner?: OwnerDto;
  reviews?: ReviewDto[];
  additionals?: VillaAdditionalPivot[];
  facilities?: VillaFacilityPivot[];
  features?: VillaFeaturePivot[];
  policies?: VillaPolicyPivot[];
}

export class VillaDto implements IVillaDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string | null;
  readonly availability!: VillaAvailability[] | null;
  readonly priceDaily!: number | null;
  readonly priceMonthly!: number | null;
  readonly priceYearly!: number | null;
  readonly discountDailyType!: DiscountType | null;
  readonly discountMonthlyType!: DiscountType | null;
  readonly discountYearlyType!: DiscountType | null;
  readonly discountDaily!: number | null;
  readonly discountMonthly!: number | null;
  readonly discountYearly!: number | null;
  readonly priceDailyAfterDiscount!: number | null;
  readonly priceMonthlyAfterDiscount!: number | null;
  readonly priceYearlyAfterDiscount!: number | null;
  readonly availabilityPerPrice!: VillaAvailabilityPerPrice[] | null;
  readonly highlight!: string | null;
  readonly address!: string | null;
  readonly country!: string | null;
  readonly state!: string | null;
  readonly city!: string | null;
  readonly postalCode!: string | null;
  readonly mapLink!: string | null;
  readonly placeNearby!: PlaceNearby[] | null;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly checkInHour!: string;

  @Transform(({ value }) => (value ? value.slice(0, 5) : null))
  readonly checkOutHour!: string;

  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[];
  readonly currencyId!: string;
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
  readonly owner?: OwnerDto;
  readonly reviews?: ReviewDto[];
  readonly additionals?: VillaAdditionalPivot[];
  readonly facilities?: VillaFacilityPivot[];
  readonly features?: VillaFeaturePivot[];
  readonly policies?: VillaPolicyPivot[];
}
