import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OwnershipType {
  Leasehold = 'leasehold',
  Freehold = 'freehold',
}

@Entity({ name: 'propertis' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  location!: string;

  @Column({ name: 'area_size', type: 'decimal', precision: 10, scale: 2 })
  areaSize!: number;

  @Column({ name: 'sale_rent_price', type: 'decimal', precision: 10, scale: 2 })
  saleRentPrice!: number;

  @Column({ name: 'ownership_type', type: 'enum', enum: OwnershipType })
  ownershipType!: OwnershipType;

  @Column({ name: 'sold_status', type: 'bool', enum: OwnershipType })
  soldStatus!: boolean;

  @Column({ name: 'average_rating', type: 'decimal', precision: 10, scale: 2 })
  averageRating!: number;

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
