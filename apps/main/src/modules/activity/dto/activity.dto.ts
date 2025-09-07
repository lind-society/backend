import { ToDecimal, ToHour } from '@apps/main/common/decorators';
import { generateShortDescription } from '@apps/main/common/helpers';
import {
  Activity,
  ActivityCategory,
  ActivityDuration,
  ActivityView,
  Currency,
  DiscountType,
  Owner,
  PlaceNearby,
} from '@apps/main/database/entities';
import {
  ActivityCategoryWithRelationsDto,
  RelatedActivityCategoryDto,
} from '@apps/main/modules/activity/category/dto';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import {
  OwnerWithRelationsDto,
  RelatedOwnerDto,
} from '@apps/main/modules/owner/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface IActivityDto
  extends Omit<
    ActivityView,
    'category' | 'currency' | 'owner' | 'bookings' | 'reviews'
  > {}

export interface IActivityWithRelationsDto extends IActivityDto {
  category?: ActivityCategoryWithRelationsDto;
  currency?: CurrencyDto;
  owner?: OwnerWithRelationsDto;
}

export interface IActivityPaginationDto
  extends Omit<
    Activity,
    | 'categoryId'
    | 'currencyId'
    | 'ownerId'
    | 'updatedAt'
    | 'deletedAt'
    | 'category'
    | 'currency'
    | 'owner'
    | 'bookings'
    | 'reviews'
  > {
  category?: RelatedActivityCategoryDto;
  currency?: RelatedCurrencyDto;
  owner?: RelatedOwnerDto;
}

export interface IRelatedActivityDto extends Pick<Activity, 'id' | 'name'> {
  category?: RelatedActivityCategoryDto;
}

export class ActivityDto implements IActivityDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly highlight!: string;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  @ToDecimal(true)
  readonly discount!: number | null;

  @Expose()
  @ToDecimal(false)
  readonly price!: number;

  @Expose()
  @ToDecimal(true)
  readonly priceAfterDiscount!: number | null;

  @Expose()
  readonly duration!: ActivityDuration;

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
  readonly openingHour!: string;

  @Expose()
  @ToHour()
  readonly closingHour!: string;

  @Expose()
  readonly startDate!: Date | null;

  @Expose()
  readonly endDate!: Date | null;

  @Expose()
  readonly dailyLimit!: number;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  @ToDecimal()
  readonly averageRating!: number;

  @Expose()
  readonly totalReview!: number;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Exclude()
  readonly categoryId!: string | null;

  @Exclude()
  readonly currencyId!: string | null;

  @Exclude()
  readonly ownerId!: string | null;

  @Expose()
  readonly totalTodayBooking!: number | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Activity): ActivityDto {
    return plainToInstance(ActivityDto, entity);
  }

  static fromEntities(entities: Activity[]): ActivityDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class ActivityWithRelationsDto
  extends ActivityDto
  implements IActivityWithRelationsDto
{
  @Expose()
  category?: ActivityCategoryWithRelationsDto;

  @Expose()
  currency?: CurrencyDto;

  @Expose()
  owner?: OwnerWithRelationsDto;

  static fromEntity(
    entity: Activity & {
      category?: ActivityCategory;
      currency?: Currency;
      owner?: Owner;
    },
  ): ActivityWithRelationsDto {
    const dto = plainToInstance(ActivityWithRelationsDto, entity);

    if (entity.category) {
      dto.category = ActivityCategoryWithRelationsDto.fromEntity(
        entity.category,
      );
    }

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = OwnerWithRelationsDto.fromEntity(entity.owner);
    }

    return dto;
  }

  static fromEntities(
    entities: (Activity & {
      category?: ActivityCategory;
      currency?: Currency;
      owner?: Owner;
    })[],
  ): ActivityWithRelationsDto[] {
    return entities.map((entity) => ({
      ...this.fromEntity(entity),
      highlight: generateShortDescription(entity.highlight),
    }));
  }
}

export class ActivityPaginationDto implements IActivityPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly secondaryName!: string;

  @Expose()
  readonly highlight!: string;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  @ToDecimal(true)
  readonly discount!: number | null;

  @Expose()
  @ToDecimal()
  readonly price!: number;

  @Expose()
  @ToDecimal(true)
  readonly priceAfterDiscount!: number | null;

  @Expose()
  readonly duration!: ActivityDuration;

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
  readonly openingHour!: string;

  @Expose()
  @ToHour()
  readonly closingHour!: string;

  @Expose()
  readonly startDate!: Date | null;

  @Expose()
  readonly endDate!: Date | null;

  @Expose()
  readonly dailyLimit!: number;

  @Expose()
  @ToDecimal()
  readonly todayBooking?: number;

  @Expose()
  readonly photos!: string[];

  @Expose()
  readonly videos!: string[] | null;

  @Expose()
  readonly video360s!: string[] | null;

  @Expose()
  readonly floorPlans!: string[] | null;

  @Expose()
  @ToDecimal()
  readonly averageRating!: number;

  @Expose()
  readonly totalReview!: number;

  @Expose()
  readonly isFavorite!: boolean | null;

  @Expose()
  @ToDecimal()
  readonly totalTodayBooking!: number | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  category?: RelatedActivityCategoryDto;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  owner?: RelatedOwnerDto;

  static fromEntity(
    entity: Activity & {
      category?: ActivityCategory;
      currency?: Currency;
      owner?: Owner;
    },
  ): ActivityPaginationDto {
    const dto = plainToInstance(ActivityPaginationDto, entity);

    if (entity.category) {
      dto.category = RelatedActivityCategoryDto.fromEntity(entity.category);
    }

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.owner) {
      dto.owner = RelatedOwnerDto.fromEntity(entity.owner);
    }

    return dto;
  }

  static fromEntities(
    entities: (Activity & {
      category?: ActivityCategory;
      currency?: Currency;
      owner?: Owner;
    })[],
  ): ActivityPaginationDto[] {
    return entities.map((entity) => ({
      ...this.fromEntity(entity),
      highlight: generateShortDescription(entity.highlight),
    }));
  }
}

export class RelatedActivityDto implements IRelatedActivityDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  category!: RelatedActivityCategoryDto;

  static fromEntity(
    entity: Activity & {
      category?: ActivityCategory;
    },
  ): RelatedActivityDto {
    const dto = plainToInstance(RelatedActivityDto, entity);

    if (entity.category) {
      dto.category = RelatedActivityCategoryDto.fromEntity(entity.category);
    }

    return dto;
  }

  static fromEntities(
    entities: (Activity & {
      category?: ActivityCategory;
    })[],
  ): RelatedActivityDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
