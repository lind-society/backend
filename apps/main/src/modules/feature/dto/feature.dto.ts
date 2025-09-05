import { ToDecimal } from '@apps/main/common/decorators';
import {
  Currency,
  DiscountType,
  Feature,
  Property,
  Villa,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';
import {
  PropertyWithRelationsDto,
  RelatedPropertyDto,
} from '@apps/main/modules/property/dto/property.dto';
import { IconDto } from '@apps/main/modules/shared/dto';
import {
  RelatedVillaDto,
  VillaWithRelationsDto,
} from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { RelatedCurrencyDto } from './../../currency/dto/currency.dto';

export interface IFeatureDto
  extends Omit<Feature, 'propertyFeatures' | 'villaFeatures' | 'currency'> {}

export interface IFeatureWithRelationsDto extends IFeatureDto {
  currency?: CurrencyDto;
  properties?: PropertyWithRelationsDto[];
  villas?: VillaWithRelationsDto[];
}

export interface IFeaturePaginationDto
  extends Omit<
    Feature,
    | 'updatedAt'
    | 'deletedAt'
    | 'currency'
    | 'propertyFeatures'
    | 'villaFeatures'
  > {
  currency?: RelatedCurrencyDto;
  properties?: RelatedPropertyDto[];
  villas?: RelatedVillaDto[];
}

export interface IRelatedFeatureDto
  extends Pick<
    Feature,
    | 'id'
    | 'name'
    | 'type'
    | 'icon'
    | 'free'
    | 'price'
    | 'discountType'
    | 'discount'
    | 'priceAfterDiscount'
  > {
  currency?: RelatedCurrencyDto;
}

export class FeatureDto implements IFeatureDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: string;

  @Expose()
  readonly icon!: IconDto;

  @Expose()
  readonly free!: boolean;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  @ToDecimal(true)
  readonly price!: number | null;

  @Expose()
  readonly discountType!: DiscountType;

  @Expose()
  @ToDecimal(true)
  readonly discount!: number | null;

  @Expose()
  @ToDecimal(true)
  readonly priceAfterDiscount!: number | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date;

  static fromEntity(entity: Feature): FeatureDto {
    return plainToInstance(FeatureDto, entity);
  }

  static fromEntities(entities: Feature[]): FeatureDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class FeatureWithRelationsDto
  extends FeatureDto
  implements IFeatureWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  properties?: PropertyWithRelationsDto[];

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: Feature & {
      currency?: Currency;
      properties?: Property[];
      villas?: Villa[];
    },
  ): FeatureWithRelationsDto {
    const dto = plainToInstance(FeatureWithRelationsDto, entity);

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.properties) {
      dto.properties = PropertyWithRelationsDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Feature & {
      currency?: Currency;
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): FeatureWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class FeaturePaginationDto implements IFeaturePaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: string;

  @Expose()
  readonly icon!: IconDto;

  @Expose()
  readonly free!: boolean;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  @ToDecimal(true)
  readonly price!: number | null;

  @Expose()
  readonly discountType!: DiscountType;

  @Expose()
  @ToDecimal(true)
  readonly discount!: number | null;

  @Expose()
  @ToDecimal(true)
  readonly priceAfterDiscount!: number | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  properties?: RelatedPropertyDto[];

  @Expose()
  villas?: RelatedVillaDto[];

  static fromEntity(
    entity: Feature & {
      currency?: Currency;
      properties?: Property[];
      villas?: Villa[];
    },
  ): FeaturePaginationDto {
    const dto = plainToInstance(FeaturePaginationDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.properties) {
      dto.properties = RelatedPropertyDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = RelatedVillaDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Feature & {
      currency?: Currency;
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): FeaturePaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedFeatureDto implements IRelatedFeatureDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: string;

  @Expose()
  readonly icon!: IconDto;

  @Expose()
  readonly free!: boolean;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  @ToDecimal(true)
  readonly price!: number | null;

  @Expose()
  readonly discountType!: DiscountType;

  @Expose()
  @ToDecimal(true)
  readonly discount!: number | null;

  @Expose()
  @ToDecimal(true)
  readonly priceAfterDiscount!: number | null;

  @Expose()
  currency?: RelatedCurrencyDto;

  static fromEntity(
    entity: Feature & {
      currency?: Currency;
    },
  ): RelatedFeatureDto {
    const dto = plainToInstance(RelatedFeatureDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    return dto;
  }

  static fromEntities(
    entities: (Feature & {
      currency?: Currency;
    })[],
  ): RelatedFeatureDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
