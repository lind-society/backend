import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from './currency.entity';
import { DiscountType } from './shared-enum.entity';
import { VillaPriceRulePivot } from './villa-price-rule-pivot.entity';

export enum VillaPriceRuleSeason {
  Regular_Season = 'Regular Season',
  Low_Season = 'Low Season',
  High_Season = 'High Season',
  Peak_Season = 'Peak Season',
}

@Entity('villa_price_rules')
export class VillaPriceRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate!: Date;

  @Column({
    type: 'enum',
    enum: VillaPriceRuleSeason,
    enumName: 'villa_price_rule_season_enum',
  })
  season!: VillaPriceRuleSeason;

  @Column({ name: 'is_discount', type: 'boolean', default: false })
  isDiscount!: boolean;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
    enumName: 'discount_type_enum',
    nullable: true,
  })
  discountType!: DiscountType | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discount!: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'currency_id', type: 'uuid', nullable: true })
  currencyId: string | null;

  @OneToMany(
    () => VillaPriceRulePivot,
    (villaPriceRulePivot) => villaPriceRulePivot.priceRule,
  )
  villaPriceRules!: VillaPriceRulePivot[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency | null;

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
