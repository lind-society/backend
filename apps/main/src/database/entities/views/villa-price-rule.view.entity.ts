import { ViewColumn, ViewEntity } from 'typeorm';
import { BaseVillaPriceRule } from '../villa-price-rule.entity';

@ViewEntity({
  name: 'villa_price_rules_view',
  expression: `
    SELECT
      vpr.*,
      (
        SELECT COUNT(vprp.villa_id)
        FROM villa_price_rule_pivot AS vprp
        WHERE vprp.price_rule_id = vpr.id
      ) = (
        SELECT COUNT(villas.id) FROM villas
      ) AS is_applied_to_all_villa
    FROM
      villa_price_rules AS vpr;
  `,
})
export class VillaPriceRuleView extends BaseVillaPriceRule {
  @ViewColumn({ name: 'is_applied_to_all_villa' })
  isAppliedToAllVilla!: boolean;
}
