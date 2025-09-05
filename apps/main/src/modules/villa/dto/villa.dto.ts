import { ToHour } from '@apps/main/common/decorators';
import {
  Booking,
  Currency,
  DiscountType,
  Owner,
  PlaceNearby,
  Review,
  Villa,
  VillaAdditionalPivot,
  VillaAvailability,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaPolicyPivot,
  VillaPriceRulePivot,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import {
  OwnerWithRelationsDto,
  RelatedOwnerDto,
} from '@apps/main/modules/owner/dto';
import {
  RelatedReviewDto,
  ReviewWithRelationsDto,
} from '@apps/main/modules/review/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import {
  AdditionalWithRelationsDto,
  RelatedAdditionalDto,
} from '../../additional/dto';
import { BookingWithRelationsDto, RelatedBookingDto } from '../../booking/dto';
import {
  FacilityWithRelationsDto,
  RelatedFacilityDto,
} from '../../facility/dto';
import { FeatureWithRelationsDto, RelatedFeatureDto } from '../../feature/dto';
import {
  RelatedVillaPolicyDto,
  VillaPolicyWithRelationsDto,
} from '../policy/dto';
import {
  RelatedVillaPriceRuleDto,
  VillaPriceRuleWithRelationsDto,
} from '../price-rule/dto';

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

export class CurrentVillaPrices implements ICurrentVillaPrices {
  currentSeason: VillaPriceRuleSeason;
  currentIsDiscount: boolean;
  currentDiscountType?: DiscountType;
  currentDiscount?: number;
  currentDailyPrice?: number;
  currentDailyPriceAfterDiscount?: number;
  currencyId: string;
  currency?: CurrencyDto;
}

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
  owner?: OwnerWithRelationsDto;
  bookings?: BookingWithRelationsDto[];
  reviews?: ReviewWithRelationsDto[];
  additionals?: AdditionalWithRelationsDto[];
  facilities?: FacilityWithRelationsDto[];
  features?: FeatureWithRelationsDto[];
  policies?: VillaPolicyWithRelationsDto[];
  priceRules?: VillaPriceRuleWithRelationsDto[];
}

export interface IVillaPaginationDto
  extends Omit<
    Villa,
    | 'updatedAt'
    | 'deletedAt'
    | 'currency'
    | 'owner'
    | 'villaFacilities'
    | 'villaFeatures'
    | 'villaAdditionals'
    | 'villaPolicies'
    | 'villaPriceRules'
    | 'bookings'
    | 'reviews'
  > {
  currency?: RelatedCurrencyDto;
  owner?: RelatedOwnerDto;
  bookings?: RelatedBookingDto[];
  reviews?: RelatedReviewDto[];
  additionals?: RelatedAdditionalDto[];
  facilities?: RelatedFacilityDto[];
  features?: RelatedFeatureDto[];
  policies?: RelatedVillaPolicyDto[];
  priceRules?: RelatedVillaPriceRuleDto[];
}

export interface IRelatedVillaDto extends Pick<Villa, 'id' | 'name'> {}

export class VillaDto implements IVillaDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly availability!: VillaAvailability;

  @Expose()
  readonly dailyPrice!: number | null;

  @Expose()
  readonly lowSeasonDailyPrice!: number | null;

  @Expose()
  readonly highSeasonDailyPrice!: number | null;

  @Expose()
  readonly peakSeasonDailyPrice!: number | null;

  @Expose()
  dailyPriceAfterDiscount!: number | null;

  @Expose()
  lowSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  highSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  peakSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  readonly priceMonthly!: number | null;

  @Expose()
  readonly priceYearly!: number | null;

  @Expose()
  readonly discountMonthlyType!: DiscountType | null;

  @Expose()
  readonly discountYearlyType!: DiscountType | null;

  @Expose()
  readonly discountMonthly!: number | null;

  @Expose()
  readonly discountYearly!: number | null;

  @Expose()
  readonly priceMonthlyAfterDiscount!: number | null;

  @Expose()
  readonly priceYearlyAfterDiscount!: number | null;

  @Expose()
  readonly availabilityQuotaPerMonth!: number | null;

  @Expose()
  readonly availabilityQuotaPerYear!: number | null;

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
  @ToHour()
  readonly checkInHour!: string;

  @Expose()
  @ToHour()
  readonly checkOutHour!: string;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  readonly averageRating!: number;

  @Expose()
  readonly totalReview!: number;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Expose()
  readonly currencyId!: string | null;

  @Expose()
  readonly ownerId!: string | null;

  @Expose()
  currentPrice?: CurrentVillaPrices | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Villa): VillaDto {
    return plainToInstance(VillaDto, entity);
  }

  static fromEntities(entities: Villa[]): VillaDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaWithRelationsDto
  extends VillaDto
  implements IVillaWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  owner?: OwnerWithRelationsDto;

  @Expose()
  bookings?: BookingWithRelationsDto[];

  @Expose()
  reviews?: ReviewWithRelationsDto[];

  @Expose()
  additionals?: AdditionalWithRelationsDto[];

  @Expose()
  facilities?: FacilityWithRelationsDto[];

  @Expose()
  features?: FeatureWithRelationsDto[];

  @Expose()
  policies?: VillaPolicyWithRelationsDto[];

  @Expose()
  priceRules?: VillaPriceRuleWithRelationsDto[];

  static fromEntity(
    entity: Villa & {
      currency?: Currency;
      owner?: Owner;
      additionals?: VillaAdditionalPivot[];
      facilities?: VillaFacilityPivot[];
      features?: VillaFeaturePivot[];
      policies?: VillaPolicyPivot[];
      priceRules?: VillaPriceRulePivot[];
    },
  ): VillaWithRelationsDto {
    const dto = plainToInstance(VillaWithRelationsDto, {
      ...omit(entity, [
        'villaAdditionals',
        'villaFacilities',
        'villaFeatures',
        'villaPolicies',
        'villaPriceRules',
      ]),
    });

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = OwnerWithRelationsDto.fromEntity(entity.owner);
    }

    if (entity.bookings) {
      dto.bookings = BookingWithRelationsDto.fromEntities(entity.bookings);
    }

    if (entity.reviews) {
      dto.reviews = ReviewWithRelationsDto.fromEntities(entity.reviews);
    }

    if (entity.villaAdditionals) {
      dto.additionals = entity.villaAdditionals.map(
        ({ id: pivotId, additional }) => ({
          ...AdditionalWithRelationsDto.fromEntity(additional),
          pivotId,
        }),
      );
    }

    if (entity.villaFacilities) {
      dto.facilities = entity.villaFacilities.map(
        ({ id: pivotId, includeDescription, description, facility }) => ({
          ...FacilityWithRelationsDto.fromEntity(facility),
          description: includeDescription ? description : undefined,
          pivotId,
        }),
      );
    }

    if (entity.villaFeatures) {
      dto.features = entity.villaFeatures.map(({ id: pivotId, feature }) => ({
        ...FeatureWithRelationsDto.fromEntity(feature),
        pivotId,
      }));
    }

    if (entity.villaPolicies) {
      dto.policies = entity.villaPolicies.map(({ id: pivotId, policy }) => ({
        ...VillaPolicyWithRelationsDto.fromEntity(policy),
        pivotId,
      }));
    }

    if (entity.villaPriceRules) {
      dto.priceRules = entity.villaPriceRules.map(
        ({ id: pivotId, priceRule }) => ({
          ...VillaPriceRuleWithRelationsDto.fromEntity(priceRule),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (Villa & {
      currency?: Currency;
      owner?: Owner;
      bookings?: Booking[];
      reviews?: Review[];
      additionals?: VillaAdditionalPivot[];
      facilities?: VillaFacilityPivot[];
      features?: VillaFeaturePivot[];
      policies?: VillaPolicyPivot[];
      priceRules?: VillaPriceRulePivot[];
    })[],
  ): VillaWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPaginationDto implements IVillaPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly availability!: VillaAvailability;

  @Expose()
  readonly dailyPrice!: number | null;

  @Expose()
  readonly lowSeasonDailyPrice!: number | null;

  @Expose()
  readonly highSeasonDailyPrice!: number | null;

  @Expose()
  readonly peakSeasonDailyPrice!: number | null;

  @Expose()
  dailyPriceAfterDiscount!: number | null;

  @Expose()
  lowSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  highSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  peakSeasonDailyPriceAfterDiscount!: number | null;

  @Expose()
  readonly priceMonthly!: number | null;

  @Expose()
  readonly priceYearly!: number | null;

  @Expose()
  readonly discountMonthlyType!: DiscountType | null;

  @Expose()
  readonly discountYearlyType!: DiscountType | null;

  @Expose()
  readonly discountMonthly!: number | null;

  @Expose()
  readonly discountYearly!: number | null;

  @Expose()
  readonly priceMonthlyAfterDiscount!: number | null;

  @Expose()
  readonly priceYearlyAfterDiscount!: number | null;

  @Expose()
  readonly availabilityQuotaPerMonth!: number | null;

  @Expose()
  readonly availabilityQuotaPerYear!: number | null;

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
  @ToHour()
  readonly checkInHour!: string;

  @Expose()
  @ToHour()
  readonly checkOutHour!: string;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  readonly averageRating!: number;

  @Expose()
  readonly totalReview!: number;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Expose()
  readonly currencyId!: string | null;

  @Expose()
  readonly ownerId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  currentPrice?: CurrentVillaPrices | null;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  owner?: RelatedOwnerDto;

  @Expose()
  bookings?: RelatedBookingDto[];

  @Expose()
  reviews?: RelatedReviewDto[];

  @Expose()
  additionals?: RelatedAdditionalDto[];

  @Expose()
  facilities?: RelatedFacilityDto[];

  @Expose()
  features?: RelatedFeatureDto[];

  @Expose()
  policies?: RelatedVillaPolicyDto[];

  @Expose()
  priceRules?: RelatedVillaPriceRuleDto[];

  static fromEntity(
    entity: Villa & {
      currency?: Currency;
      owner?: Owner;
      bookings?: Booking[];
      reviews?: Review[];
      additionals?: VillaAdditionalPivot[];
      facilities?: VillaFacilityPivot[];
      features?: VillaFeaturePivot[];
      policies?: VillaPolicyPivot[];
      priceRules?: VillaPriceRulePivot[];
    },
  ): VillaPaginationDto {
    const dto = plainToInstance(VillaPaginationDto, {
      ...omit(entity, [
        'villaAdditionals',
        'villaFacilities',
        'villaFeatures',
        'villaPolicies',
        'villaPriceRules',
      ]),
    });

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = RelatedOwnerDto.fromEntity(entity.owner);
    }

    if (entity.bookings) {
      dto.bookings = RelatedBookingDto.fromEntities(entity.bookings);
    }

    if (entity.reviews) {
      dto.reviews = RelatedReviewDto.fromEntities(entity.reviews);
    }

    if (entity.villaAdditionals) {
      dto.additionals = entity.villaAdditionals.map(
        ({ id: pivotId, additional }) => ({
          ...RelatedAdditionalDto.fromEntity(additional),
          pivotId,
        }),
      );
    }

    if (entity.villaFacilities) {
      dto.facilities = entity.villaFacilities.map(
        ({ id: pivotId, includeDescription, description, facility }) => ({
          ...RelatedFacilityDto.fromEntity(facility),
          description: includeDescription ? description : undefined,
          pivotId,
        }),
      );
    }

    if (entity.villaFeatures) {
      dto.features = entity.villaFeatures.map(({ id: pivotId, feature }) => ({
        ...RelatedFeatureDto.fromEntity(feature),
        pivotId,
      }));
    }

    if (entity.villaPolicies) {
      dto.policies = entity.villaPolicies.map(({ id: pivotId, policy }) => ({
        ...RelatedVillaPolicyDto.fromEntity(policy),
        pivotId,
      }));
    }

    if (entity.villaPriceRules) {
      dto.priceRules = entity.villaPriceRules.map(
        ({ id: pivotId, priceRule }) => ({
          ...RelatedVillaPriceRuleDto.fromEntity(priceRule),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (Villa & {
      currency?: Currency;
      owner?: Owner;
      additionals?: VillaAdditionalPivot[];
      facilities?: VillaFacilityPivot[];
      features?: VillaFeaturePivot[];
      policies?: VillaPolicyPivot[];
      priceRules?: VillaPriceRulePivot[];
    })[],
  ): VillaPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedVillaDto implements IRelatedVillaDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: Villa): RelatedVillaDto {
    return plainToInstance(RelatedVillaDto, entity);
  }

  static fromEntities(entities: Villa[]): RelatedVillaDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
