import {
  Currency,
  DiscountType,
  Villa,
  VillaPriceRule,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { RelatedVillaDto, VillaWithRelationsDto } from '../../dto';

export interface IVillaPriceRuleDto
  extends Omit<VillaPriceRule, 'villaPriceRules' | 'currency'> {
  isAppliedToAllVilla?: boolean;
}

export interface IVillaPriceRuleWithRelationsDto extends IVillaPriceRuleDto {
  currency?: CurrencyDto;
  villas?: VillaWithRelationsDto[];
}

export interface IVillaPriceRulePaginationDto
  extends Omit<
    VillaPriceRule,
    'currencyId' | 'updatedAt' | 'deletedAt' | 'currency' | 'villaPriceRules'
  > {
  isAppliedToAllVilla?: boolean;
  currency?: RelatedCurrencyDto;
  villas?: RelatedVillaDto[];
}

export interface IRelatedVillaPriceRuleDto
  extends Pick<
    VillaPriceRule,
    | 'id'
    | 'name'
    | 'startDate'
    | 'endDate'
    | 'season'
    | 'isDiscount'
    | 'discountType'
    | 'discount'
    | 'isActive'
  > {
  isAppliedToAllVilla?: boolean;
  currency?: RelatedCurrencyDto;
}

export class VillaPriceRuleDto implements IVillaPriceRuleDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly startDate!: Date;

  @Expose()
  readonly endDate!: Date;

  @Expose()
  readonly season!: VillaPriceRuleSeason;

  @Expose()
  readonly isDiscount!: boolean;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  readonly discount!: number | null;

  @Expose()
  readonly currencyId!: string | null;

  @Expose()
  readonly isActive!: boolean | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date;

  @Expose()
  isAppliedToAllVilla?: boolean;

  static fromEntity(entity: VillaPriceRule): VillaPriceRuleDto {
    return plainToInstance(VillaPriceRuleDto, entity);
  }

  static fromEntities(entities: VillaPriceRule[]): VillaPriceRuleDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPriceRuleWithRelationsDto
  extends VillaPriceRuleDto
  implements IVillaPriceRuleWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: VillaPriceRule & {
      currency?: Currency;
      villas?: Villa[];
    },
  ): VillaPriceRuleWithRelationsDto {
    const dto = VillaPriceRuleWithRelationsDto.fromEntity(entity);

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.villas) {
      VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPriceRule & {
      currency?: Currency;
      villas?: Villa[];
    })[],
  ): VillaPriceRuleWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPriceRulePaginationDto
  implements IVillaPriceRulePaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly startDate!: Date;

  @Expose()
  readonly endDate!: Date;

  @Expose()
  readonly season!: VillaPriceRuleSeason;

  @Expose()
  readonly isDiscount!: boolean;

  @Expose()
  readonly discountType!: DiscountType | null;

  @Expose()
  readonly discount!: number | null;

  @Expose()
  readonly isActive!: boolean;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  isAppliedToAllVilla?: boolean;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  villas?: RelatedVillaDto[];

  static fromEntity(
    entity: VillaPriceRule & {
      currency?: Currency;
      villas?: Villa[];
    },
  ): VillaPriceRulePaginationDto {
    const dto = plainToInstance(VillaPriceRulePaginationDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.villas) {
      dto.villas = RelatedVillaDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPriceRule & {
      currency?: Currency;
      villas?: Villa[];
    })[],
  ): VillaPriceRulePaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedVillaPriceRuleDto implements IRelatedVillaPriceRuleDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly startDate!: Date;

  @Expose()
  readonly endDate!: Date;

  @Expose()
  readonly season!: VillaPriceRuleSeason;

  @Expose()
  readonly isDiscount!: boolean;

  @Expose()
  readonly discountType!: DiscountType;

  @Expose()
  readonly discount!: number;

  @Expose()
  readonly isActive!: boolean;

  @Expose()
  isAppliedToAllVilla?: boolean;

  @Expose()
  currency?: RelatedCurrencyDto;

  static fromEntity(
    entity: VillaPriceRule & {
      currency?: Currency;
    },
  ): RelatedVillaPriceRuleDto {
    const dto = plainToInstance(RelatedVillaPriceRuleDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPriceRule & {
      currency?: Currency;
    })[],
  ): RelatedVillaPriceRuleDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
