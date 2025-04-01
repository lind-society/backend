import {
  DiscountType,
  PlaceNearby,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
  PropertyOwnershipType,
} from 'src/database/entities';
import { CurrencyDto } from 'src/modules/currency/dto';
import { OwnerDto } from 'src/modules/owner/dto';
import { ReviewDto } from 'src/modules/review/dto';

export interface IPropertyDto
  extends Omit<
    Property,
    | 'currency'
    | 'owner'
    | 'reviews'
    | 'propertyFacilities'
    | 'propertyFeatures'
    | 'propertyAdditionals'
  > {}

export interface IPropertyWithRelationsDto extends IPropertyDto {
  currency?: CurrencyDto;
  owner?: OwnerDto;
  reviews?: ReviewDto[];
  facilities?: PropertyFacilityPivot[];
  features?: PropertyFeaturePivot[];
  additionals?: PropertyAdditionalPivot[];
}

export class PropertyDto implements IPropertyDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string | null;
  readonly price!: number | null;
  readonly discountType!: DiscountType | null;
  readonly discount!: number | null;
  readonly priceAfterDiscount!: number | null;
  readonly ownershipType!: PropertyOwnershipType;
  readonly highlight!: string | null;
  readonly address!: string | null;
  readonly country!: string | null;
  readonly state!: string | null;
  readonly city!: string | null;
  readonly postalCode!: string | null;
  readonly mapLink!: string | null;
  readonly placeNearby!: PlaceNearby[] | null;
  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[];
  readonly soldStatus!: boolean;
  readonly averageRating!: number | null;
  readonly currencyId!: string;
  readonly ownerId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class PropertyWithRelationsDto
  extends PropertyDto
  implements IPropertyWithRelationsDto
{
  readonly currency?: CurrencyDto;
  readonly owner?: OwnerDto;
  readonly reviews?: ReviewDto[];
  readonly facilities?: PropertyFacilityPivot[];
  readonly features?: PropertyFeaturePivot[];
  readonly additionals?: PropertyAdditionalPivot[];
}
