import { VillaPriceRule, VillaPriceRuleSeason } from 'src/database/entities';
import { VillaDto } from '../../dto';

export interface IVillaPriceRuleDto
  extends Omit<VillaPriceRule, 'villaPriceRules'> {}

export interface IVillaPriceRuleWithRelationsDto extends IVillaPriceRuleDto {
  villas?: VillaDto[];
}

export class VillaPriceRuleDto implements IVillaPriceRuleDto {
  readonly id!: string;
  readonly name!: string;
  readonly description!: string | null;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly season!: VillaPriceRuleSeason;
  readonly isDiscount!: boolean;
  readonly discount!: number | null;
  readonly isActive!: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaPriceRuleWithRelationsDto
  extends VillaPriceRuleDto
  implements IVillaPriceRuleWithRelationsDto
{
  readonly villas?: VillaDto[];
}
