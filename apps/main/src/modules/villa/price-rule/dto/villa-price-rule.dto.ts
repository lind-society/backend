import {
  DiscountType,
  VillaPriceRule,
  VillaPriceRulePivot,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import { CurrencyDto } from '@apps/main/modules/currency/dto';

export interface IVillaPriceRuleDto
  extends Omit<VillaPriceRule, 'villaPriceRules' | 'currency'> {}

export interface IVillaPriceRuleWithRelationsDto extends IVillaPriceRuleDto {
  villas?: VillaPriceRulePivot[];
  currency?: CurrencyDto;
}

export class VillaPriceRuleDto implements IVillaPriceRuleDto {
  readonly id!: string;
  readonly name!: string;
  readonly description!: string | null;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly season!: VillaPriceRuleSeason;
  readonly isDiscount!: boolean;
  readonly discountType!: DiscountType;
  readonly discount!: number | null;
  readonly currencyId!: string | null;
  readonly isActive!: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaPriceRuleWithRelationsDto
  extends VillaPriceRuleDto
  implements IVillaPriceRuleWithRelationsDto
{
  readonly villas?: VillaPriceRulePivot[];
  readonly currency?: CurrencyDto;
}
