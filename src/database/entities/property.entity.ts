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
import { Owner } from './owner.entity';
import { PropertyAdditionalPivot } from './property-additional-pivot.entity';
import { PropertyFacilityPivot } from './property-facility-pivot.entity';
import { PropertyFeaturePivot } from './property-feature-pivot.entity';
import { Review } from './review.entity';
import { DiscountType } from './shared-enum.entity';
import { PlaceNearby } from './shared-interface.entity';

export enum PropertyOwnershipType {
  Leasehold = 'leasehold',
  Freehold = 'freehold',
}

@Entity({ name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'secondary_name', nullable: true })
  secondaryName!: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  price!: number | null;

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

  @Column({
    name: 'price_after_discount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    generatedType: 'STORED',
    asExpression: `
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
      END
    `,
    nullable: true,
  })
  priceAfterDiscount!: number | null;

  @Column({ name: 'ownership_type', type: 'enum', enum: PropertyOwnershipType })
  ownershipType!: PropertyOwnershipType;

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
  placeNearby!: PlaceNearby[] | null;

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

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  averageRating!: number | null;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string | null;

  @OneToMany(() => Review, (review) => review.property)
  reviews: Review[];

  @OneToMany(
    () => PropertyFacilityPivot,
    (propertyFacilityPivot) => propertyFacilityPivot.property,
  )
  propertyFacilities!: PropertyFacilityPivot[];

  @OneToMany(
    () => PropertyFeaturePivot,
    (propertyFeaturePivot) => propertyFeaturePivot.property,
  )
  propertyFeatures!: PropertyFeaturePivot[];

  @OneToMany(
    () => PropertyAdditionalPivot,
    (propertyAdditionalPivot) => propertyAdditionalPivot.property,
  )
  propertyAdditionals!: PropertyAdditionalPivot[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

  @ManyToOne(() => Owner, (owner) => owner.properties, {
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
