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
import { PropertyFeaturePivot } from './property-feature-pivot.entity';
import { DiscountType } from './shared-enum.entity';
import { VillaFeaturePivot } from './villa-feature-pivot.entity';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string | null;

  @Column()
  free!: boolean;

  @Column({ name: 'currency_id', type: 'uuid', nullable: true })
  currencyId!: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  price!: number | null;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
    nullable: true,
  })
  discountType!: DiscountType | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discount!: number | null;

  @Column({
    name: 'price_after_discount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    generatedType: 'STORED',
    asExpression: `
        CASE 
          WHEN discount_type = 'percentage' THEN 
            GREATEST(price - (price * discount / 100), 0)
          ELSE 
            GREATEST(price - discount, 0)
        END
      `,
    nullable: true,
  })
  priceAfterDiscount!: number | null;

  @OneToMany(
    () => PropertyFeaturePivot,
    (propertyFeaturePivot) => propertyFeaturePivot.feature,
  )
  propertyFeatures!: PropertyFeaturePivot[];

  @OneToMany(
    () => VillaFeaturePivot,
    (villaFeaturePivot) => villaFeaturePivot.feature,
  )
  villaFeatures!: VillaFeaturePivot[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

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
