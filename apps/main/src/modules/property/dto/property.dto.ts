import {
  Currency,
  DiscountType,
  Owner,
  PlaceNearby,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
  PropertyOwnershipType,
} from '@apps/main/database/entities';
import {
  AdditionalWithRelationsDto,
  RelatedAdditionalDto,
} from '@apps/main/modules/additional/dto';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import {
  OwnerDto,
  OwnerWithRelationsDto,
  RelatedOwnerDto,
} from '@apps/main/modules/owner/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import {
  FacilityWithRelationsDto,
  RelatedFacilityDto,
} from '../../facility/dto';
import { FeatureWithRelationsDto, RelatedFeatureDto } from '../../feature/dto';
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
  owner?: OwnerWithRelationsDto;
  facilities?: FacilityWithRelationsDto[];
  features?: FeatureWithRelationsDto[];
  additionals?: AdditionalWithRelationsDto[];
}

export interface IPropertyPaginationDto
  extends Omit<
    Property,
    | 'updatedAt'
    | 'deletedAt'
    | 'currency'
    | 'owner'
    | 'propertyFacilities'
    | 'propertyFeatures'
    | 'propertyAdditionals'
  > {
  currency?: RelatedCurrencyDto;
  owner?: RelatedOwnerDto;
  facilities?: RelatedFacilityDto[];
  features?: RelatedFeatureDto[];
  additionals?: RelatedAdditionalDto[];
}

export interface IRelatedPropertyDto extends Pick<Property, 'id' | 'name'> {}

export class PropertyDto implements IPropertyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly price!: number;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  readonly discount!: number | null;

  @Expose()
  readonly priceAfterDiscount!: number | null;

  @Expose()
  readonly ownershipType!: PropertyOwnershipType;

  @Expose()
  readonly highlight!: string;

  @Expose()
  readonly address!: string;

  @Expose()
  readonly country!: string;

  @Expose()
  readonly state!: string;

  @Expose()
  readonly city!: string;

  @Expose()
  readonly postalCode!: string;

  @Expose()
  readonly mapLink!: string;

  @Expose()
  readonly placeNearby!: PlaceNearby[] | null;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  readonly soldStatus!: boolean;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Expose()
  readonly currencyId!: string | null;

  @Expose()
  readonly ownerId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Property): PropertyDto {
    return plainToInstance(PropertyDto, entity);
  }

  static fromEntities(entities: Property[]): PropertyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PropertyWithRelationsDto
  extends PropertyDto
  implements IPropertyWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  owner?: OwnerDto;

  @Expose()
  facilities?: FacilityWithRelationsDto[];

  @Expose()
  features?: FeatureWithRelationsDto[];

  @Expose()
  additionals?: AdditionalWithRelationsDto[];

  static fromEntity(
    entity: Property & {
      currency?: Currency;
      owner?: Owner;
      facilities?: PropertyFacilityPivot[];
      features?: PropertyFeaturePivot[];
      additionals?: PropertyAdditionalPivot[];
    },
  ): PropertyWithRelationsDto {
    const dto = plainToInstance(PropertyWithRelationsDto, {
      ...omit(entity, [
        'propertyAdditionals',
        'propertyFacilities',
        'propertyFeatures',
      ]),
    });

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = OwnerWithRelationsDto.fromEntity(entity.owner);
    }

    if (entity.propertyAdditionals) {
      dto.additionals = entity.propertyAdditionals.map(
        ({ id: pivotId, additional }) => ({
          ...AdditionalWithRelationsDto.fromEntity(additional),
          pivotId,
        }),
      );
    }

    if (entity.propertyFacilities) {
      dto.facilities = entity.propertyFacilities.map(
        ({ id: pivotId, includeDescription, description, facility }) => ({
          ...FacilityWithRelationsDto.fromEntity(facility),
          pivotId,
          description: includeDescription ? description : undefined,
        }),
      );
    }

    if (entity.propertyFeatures) {
      dto.features = entity.propertyFeatures.map(
        ({ id: pivotId, feature }) => ({
          ...FeatureWithRelationsDto.fromEntity(feature),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (Property & {
      currency?: Currency;
      owner?: Owner;
      facilities?: PropertyFacilityPivot[];
      features?: PropertyFeaturePivot[];
      additionals?: PropertyAdditionalPivot[];
    })[],
  ): PropertyWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PropertyPaginationDto implements IPropertyPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly price!: number;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  readonly discount!: number | null;

  @Expose()
  readonly priceAfterDiscount!: number | null;

  @Expose()
  readonly ownershipType!: PropertyOwnershipType;

  @Expose()
  readonly highlight!: string;

  @Expose()
  readonly address!: string;

  @Expose()
  readonly country!: string;

  @Expose()
  readonly state!: string;

  @Expose()
  readonly city!: string;

  @Expose()
  readonly postalCode!: string;

  @Expose()
  readonly mapLink!: string;

  @Expose()
  readonly placeNearby!: PlaceNearby[] | null;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  readonly soldStatus!: boolean;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Exclude()
  readonly currencyId!: string | null;

  @Exclude()
  readonly ownerId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  owner?: RelatedOwnerDto;

  @Expose()
  facilities?: RelatedFacilityDto[];

  @Expose()
  features?: RelatedFeatureDto[];

  @Expose()
  additionals?: RelatedAdditionalDto[];

  static fromEntity(
    entity: Property & {
      currency?: Currency;
      owner?: Owner;
      facilities?: PropertyFacilityPivot[];
      features?: PropertyFeaturePivot[];
      additionals?: PropertyAdditionalPivot[];
    },
  ): PropertyPaginationDto {
    const dto = plainToInstance(PropertyPaginationDto, {
      ...omit(entity, [
        'propertyAdditionals',
        'propertyFacilities',
        'propertyFeatures',
      ]),
    });

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = RelatedOwnerDto.fromEntity(entity.owner);
    }

    if (entity.propertyAdditionals) {
      dto.additionals = entity.propertyAdditionals.map(
        ({ id: pivotId, additional }) => ({
          ...RelatedAdditionalDto.fromEntity(additional),
          pivotId,
        }),
      );
    }

    if (entity.propertyFacilities) {
      dto.facilities = entity.propertyFacilities.map(
        ({ id: pivotId, includeDescription, description, facility }) => ({
          ...RelatedFacilityDto.fromEntity(facility),
          pivotId,
          description: includeDescription ? description : undefined,
        }),
      );
    }

    if (entity.propertyFeatures) {
      dto.features = entity.propertyFeatures.map(
        ({ id: pivotId, feature }) => ({
          ...RelatedFeatureDto.fromEntity(feature),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (Property & {
      currency?: Currency;
      owner?: Owner;
      facilities?: PropertyFacilityPivot[];
      features?: PropertyFeaturePivot[];
      additionals?: PropertyAdditionalPivot[];
    })[],
  ): PropertyPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedPropertyDto implements IRelatedPropertyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: Property): RelatedPropertyDto {
    return plainToInstance(RelatedPropertyDto, entity);
  }

  static fromEntities(entities: Property[]): RelatedPropertyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
