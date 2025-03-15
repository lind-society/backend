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
import { Owner } from './owner.entity';
import { Review } from './review.entity';
import { VillaAdditionalPivot } from './villa-additional-pivot.entity';
import { VillaFacilityPivot } from './villa-facility-pivot.entity';
import { VillaFeaturePivot } from './villa-feature-pivot.entity';
import { VillaPolicyPivot } from './villa-policy-pivot.entity';

export enum VillaAvailability {
  Daily = 'daily',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum VillaOwnershipType {
  Leasehold = 'leasehold',
  Freehold = 'freehold',
}

export class VillaPlaceNearby {
  name!: string;
  distance!: number;
}

export class VillaAvailabilityPerPrice {
  availability!: VillaAvailability;
  quota!: number;
}

@Entity({ name: 'villas' })
export class Villa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'secondary_name', nullable: true })
  secondaryName!: string | null;

  @Column({
    type: 'enum',
    enum: VillaAvailability,
    array: true,
    nullable: true,
  })
  availability!: VillaAvailability[] | null;

  @Column({
    name: 'price_daily',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceDaily!: number | null;

  @Column({
    name: 'price_monthly',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceMonthly!: number | null;

  @Column({
    name: 'price_yearly',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceYearly!: number | null;

  @Column({
    name: 'discount_daily',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountDaily!: number | null;

  @Column({
    name: 'discount_monthly',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountMonthly!: number | null;

  @Column({
    name: 'discount_yearly',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountYearly!: number | null;

  @Column({
    name: 'price_daily_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price_daily, 0) - (COALESCE(price_daily, 0) * COALESCE(discount_daily, 0) / 100)',
    nullable: true,
  })
  priceDailyAfterDiscount!: number | null;

  @Column({
    name: 'price_monthly_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price_monthly, 0) - (COALESCE(price_monthly, 0) * COALESCE(discount_monthly, 0) / 100)',
    nullable: true,
  })
  priceMonthlyAfterDiscount!: number | null;

  @Column({
    name: 'price_yearly_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price_yearly, 0) - (COALESCE(price_yearly, 0) * COALESCE(discount_yearly, 0) / 100)',
    nullable: true,
  })
  priceYearlyAfterDiscount!: number | null;

  @Column({
    name: 'availability_per_price',
    type: 'jsonb',
    nullable: true,
  })
  availabilityPerPrice!: VillaAvailabilityPerPrice[] | null;

  @Column({ name: 'ownership_type', type: 'enum', enum: VillaOwnershipType })
  ownershipType!: VillaOwnershipType;

  // description
  @Column({ type: 'text', nullable: true })
  highlight!: string | null;

  @Column({ nullable: true })
  address!: string | null;

  @Column({ nullable: true })
  country!: string | null;

  @Column({ nullable: true })
  state!: string | null;

  @Column({ nullable: true })
  city!: string | null;

  @Column({ name: 'postal_code', nullable: true })
  postalCode!: string | null;

  @Column({ name: 'map_link', nullable: true })
  mapLink!: string | null;

  @Column({
    name: 'place_nearby',
    type: 'jsonb',
    nullable: true,
  })
  placeNearby!: VillaPlaceNearby[] | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  photos!: string[] | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  videos!: string[] | null;

  @Column({ name: 'video_360', type: 'varchar', array: true, nullable: true })
  video360s!: string[] | null;

  @Column({
    name: 'sold_status',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  soldStatus!: boolean;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: string | null;

  @OneToMany(() => Review, (review) => review.villa)
  reviews: Review[];

  @OneToMany(
    () => VillaFacilityPivot,
    (villaFacilityPivot) => villaFacilityPivot.villa,
  )
  villaFacilities!: VillaFacilityPivot[];

  @OneToMany(
    () => VillaFeaturePivot,
    (villaFeaturePivot) => villaFeaturePivot.villa,
  )
  villaFeatures!: VillaFeaturePivot[];

  @OneToMany(
    () => VillaAdditionalPivot,
    (villaAdditionalPivot) => villaAdditionalPivot.villa,
  )
  villaAdditionals!: VillaAdditionalPivot[];

  @OneToMany(
    () => VillaPolicyPivot,
    (villaPolicyPivot) => villaPolicyPivot.villa,
  )
  villaPolicies!: VillaPolicyPivot[];

  @ManyToOne(() => Owner, (owner) => owner.villas, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'owner_id' })
  owner!: Owner | null;

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
