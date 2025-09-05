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
  Regular_Season = 'regular_season',
  Low_Season = 'low_season',
  High_Season = 'high_season',
  Peak_Season = 'peak_season',
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
  })
  season!: VillaPriceRuleSeason;

  @Column({ name: 'is_discount', type: 'boolean', default: false })
  isDiscount!: boolean;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
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

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
