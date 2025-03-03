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

@Entity({ name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ nullable: true })
  location!: string | null;

  @Column({
    name: 'area_size',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  areaSize!: number | null;

  @Column({ name: 'ownership_type', type: 'enum', enum: OwnershipType })
  ownershipType!: OwnershipType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column({ nullable: true })
  address!: string | null;

  @Column({ nullable: true })
  country!: string | null;

  @Column({ nullable: true })
  state!: string | null;

  @Column({ nullable: true })
  city!: string | null;

  @Column({
    name: 'place_nearby',
    type: 'varchar',
    array: true,
    nullable: true,
  })
  placeNearby!: string[] | null;

  @Column({ name: 'postal_code', nullable: true })
  postalCode!: string | null;

  @Column({ name: 'map_link', nullable: true })
  mapLink!: string | null;

  @Column({
    name: 'sold_status',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  soldStatus!: boolean;

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
