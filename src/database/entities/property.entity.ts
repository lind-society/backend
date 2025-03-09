import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyAdditionalPivot } from './property-additional-pivot.entity';
import { PropertyFacilityPivot } from './property-facility-pivot.entity';
import { PropertyFeaturePivot } from './property-feature-pivot.entity';

export enum OwnershipType {
  Leasehold = 'leasehold',
  Freehold = 'freehold',
}

export class PlaceNearby {
  name!: string;
  distance!: number;
}

@Entity({ name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'secondary_name', nullable: true })
  secondaryName!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount!: number | null;

  @Column({
    name: 'price_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price, 0) - (COALESCE(price, 0) * COALESCE(discount, 0) / 100)',
    nullable: true,
  })
  priceAfterDiscount!: number | null;

  @Column({ name: 'ownership_type', type: 'enum', enum: OwnershipType })
  ownershipType!: OwnershipType;

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

  // Should be not nullable, adjusted after adding owner entities
  @Column({ name: 'owner_id', nullable: true })
  ownerId: string | null;

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
