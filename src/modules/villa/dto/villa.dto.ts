import {
  Villa,
  VillaAdditionalPivot,
  VillaAvailability,
  VillaAvailabilityPerPrice,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaOwnershipType,
  VillaPlaceNearby,
} from 'src/database/entities';
import { VillaPolicyPivot } from 'src/database/entities/villa-policy-pivot.entity';
import { ReviewDto } from 'src/modules/review/dto';

export interface IVillaDto
  extends Omit<
    Villa,
    | 'villaFacilities'
    | 'villaFeatures'
    | 'villaAdditionals'
    | 'villaPolicies'
    | 'reviews'
    | 'owner'
  > {}

export interface IVillaWithRelationsDto extends IVillaDto {
  additionals?: VillaAdditionalPivot[];
  facilities?: VillaFacilityPivot[];
  features?: VillaFeaturePivot[];
  policies?: VillaPolicyPivot[];
  reviews?: ReviewDto[];
}

export class VillaDto implements IVillaDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string | null;
  readonly availability!: VillaAvailability[] | null;
  readonly priceDaily!: number | null;
  readonly priceMonthly!: number | null;
  readonly priceYearly!: number | null;
  readonly discountDaily!: number | null;
  readonly discountMonthly!: number | null;
  readonly discountYearly!: number | null;
  readonly priceDailyAfterDiscount!: number | null;
  readonly priceMonthlyAfterDiscount!: number | null;
  readonly priceYearlyAfterDiscount!: number | null;
  readonly availabilityPerPrice!: VillaAvailabilityPerPrice[] | null;
  readonly ownershipType!: VillaOwnershipType;
  readonly highlight!: string | null;
  readonly address!: string | null;
  readonly country!: string | null;
  readonly state!: string | null;
  readonly city!: string | null;
  readonly postalCode!: string | null;
  readonly mapLink!: string | null;
  readonly placeNearby!: VillaPlaceNearby[] | null;
  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[];
  readonly soldStatus!: boolean;
  readonly ownerId!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaWithRelationsDto
  extends VillaDto
  implements IVillaWithRelationsDto
{
  readonly additionals?: VillaAdditionalPivot[];
  readonly facilities?: VillaFacilityPivot[];
  readonly features?: VillaFeaturePivot[];
  readonly policies?: VillaPolicyPivot[];
  readonly reviews?: ReviewDto[];
}
