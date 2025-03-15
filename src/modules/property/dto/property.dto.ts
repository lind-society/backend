import {
  Currency,
  Owner,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
  PropertyOwnershipType,
  PropertyPlaceNearby,
} from 'src/database/entities';

export interface IPropertyDto
  extends Omit<
    Property,
    | 'currency'
    | 'owner'
    | 'propertyFacilities'
    | 'propertyFeatures'
    | 'propertyAdditionals'
  > {}

export interface IPropertyWithRelationsDto extends IPropertyDto {
  currency?: Currency;
  owner?: Owner;
  facilities?: PropertyFacilityPivot[];
  features?: PropertyFeaturePivot[];
  additionals?: PropertyAdditionalPivot[];
}

export class PropertyDto implements IPropertyDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string | null;
  readonly price!: number | null;
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
  readonly placeNearby!: PropertyPlaceNearby[] | null;
  readonly photos!: string[];
  readonly videos!: string[];
  readonly video360s!: string[];
  readonly soldStatus!: boolean;
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
  readonly currency?: Currency;
  readonly owner?: Owner;
  readonly facilities?: PropertyFacilityPivot[];
  readonly features?: PropertyFeaturePivot[];
  readonly additionals?: PropertyAdditionalPivot[];
}
