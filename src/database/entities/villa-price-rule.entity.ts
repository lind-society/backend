import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VillaPriceRulePivot } from './villa-price-rule-pivot.entity';

export enum PriceRuleSeason {
  Low_Season = 'Low Season',
  Regular_Season = 'Regular Season',
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

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate!: Date | null;

  @Column({
    name: 'price_rule_season',
    type: 'enum',
    enum: PriceRuleSeason,
    enumName: 'price_rule_season_enum',
    nullable: true,
  })
  season!: PriceRuleSeason | null;

  @Column({ type: 'boolean', default: false })
  isDiscount!: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(
    () => VillaPriceRulePivot,
    (villaPriceRulePivot) => villaPriceRulePivot.priceRule,
  )
  villaPriceRules!: VillaPriceRulePivot[];

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
