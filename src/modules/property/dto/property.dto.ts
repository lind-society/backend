import {
  OwnershipType,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
} from 'src/database/entities';

export interface IPropertyDto
  extends Omit<
    Property,
    'propertyFacilities' | 'propertyFeatures' | 'propertyAdditionals'
  > {}

export interface IPropertyWithRelationsDto extends IPropertyDto {
  facilities: PropertyFacilityPivot[];
  features: PropertyFeaturePivot[];
  additionals: PropertyAdditionalPivot[];
}

export class PropertyDto implements IPropertyDto {
  readonly id!: string;
  readonly name!: string;
  readonly description!: string | null;
  readonly location!: string | null;
  readonly areaSize!: number;
  readonly ownershipType!: OwnershipType;
  readonly price!: number;
  readonly address!: string | null;
  readonly country!: string | null;
  readonly state!: string | null;
  readonly city!: string | null;
  readonly placeNearby!: string[] | null;
  readonly postalCode!: string | null;
  readonly mapLink!: string | null;
  readonly soldStatus!: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class PropertyWithRelationsDto
  extends PropertyDto
  implements IPropertyWithRelationsDto
{
  readonly facilities: PropertyFacilityPivot[];
  readonly features: PropertyFeaturePivot[];
  readonly additionals: PropertyAdditionalPivot[];
}
