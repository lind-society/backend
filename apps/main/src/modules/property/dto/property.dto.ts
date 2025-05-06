import {
  DiscountType,
  PlaceNearby,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
  PropertyOwnershipType,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import { OwnerDto } from '@apps/main/modules/owner/dto';
import { Type } from 'class-transformer';
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
  currency?: CurrencyDto;
  owner?: OwnerDto;
  facilities?: PropertyFacilityPivot[];
  features?: PropertyFeaturePivot[];
  additionals?: PropertyAdditionalPivot[];
}

export class PropertyDto implements IPropertyDto {
  readonly id!: string;
  readonly name!: string;
  readonly secondaryName!: string;
  readonly price!: number | null;
  readonly discountType!: DiscountType | null;
  readonly discount!: number | null;
  readonly priceAfterDiscount!: number | null;
  readonly ownershipType!: PropertyOwnershipType;
  readonly highlight!: string;
  readonly address!: string;
  readonly country!: string;
  readonly state!: string;
  readonly city!: string;
  readonly postalCode!: string;
  readonly mapLink!: string;
  readonly placeNearby!: PlaceNearby[] | null;
  readonly photos!: string[];
  readonly videos!: string[] | null;
  readonly video360s!: string[] | null;
  readonly floorPlans!: string[] | null;
  readonly soldStatus!: boolean;
  readonly averageRating!: number | null;
  readonly currencyId!: string | null;
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
  @Type(() => OwnerDto)
  readonly owner?: OwnerDto;
  readonly facilities?: PropertyFacilityPivot[];
  readonly features?: PropertyFeaturePivot[];
  readonly additionals?: PropertyAdditionalPivot[];
}
