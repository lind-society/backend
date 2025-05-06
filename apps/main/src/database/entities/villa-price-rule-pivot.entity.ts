import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VillaPriceRule } from './villa-price-rule.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'villa_price_rule_pivot' })
export class VillaPriceRulePivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  @Column({ name: 'price_rule_id', type: 'uuid' })
  priceRuleId!: string;

  @ManyToOne(() => Villa, (villa) => villa.villaPriceRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @ManyToOne(() => VillaPriceRule, (priceRule) => priceRule.villaPriceRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'price_rule_id' })
  priceRule!: VillaPriceRule;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
