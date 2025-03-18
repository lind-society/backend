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
import { ActivityCategory } from './activity-category.entity';
import { Currency } from './currency.entity';
import { Owner } from './owner.entity';

export enum ActivityDuration {
  Temporary = 'temporary',
  Permanent = 'permanent',
}

export class ActivityPlaceNearby {
  name!: string;
  distance!: number;
}

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'secondary_name', nullable: true })
  secondaryName!: string | null;

  @Column({ type: 'text', nullable: true })
  highlight!: string | null;

  @Column({ name: 'price_per_person', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerPerson!: number | null;

  @Column({ name: 'price_per_session', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerSession!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount!: number | null;

  @Column({
    name: 'price_per_person_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price_per_person, 0) - (COALESCE(price_per_person, 0) * COALESCE(discount, 0) / 100)',
    nullable: true,
  })
  pricePerPersonAfterDiscount!: number | null;
  
  @Column({
    name: 'price_per_session_after_discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression:
      'COALESCE(price_per_session, 0) - (COALESCE(price_per_session, 0) * COALESCE(discount, 0) / 100)',
    nullable: true,
  })
  pricePerSessionAfterDiscount!: number | null;

  @Column({ type: 'enum', enum: ActivityDuration })
  duration!: ActivityDuration;

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
  placeNearby!: ActivityPlaceNearby[] | null;

  @Column({ name: 'opening_hour', type: 'time', precision: 0 })
  openingHour!: string;

  @Column({ name: 'closing_hour', type: 'time', precision: 0 })
  closingHour!: string;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  photos!: string[] | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  videos!: string[] | null;

  @Column({ name: 'video_360', type: 'varchar', array: true, nullable: true })
  video360s!: string[] | null;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string | null;

  @ManyToOne(() => ActivityCategory, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category!: ActivityCategory;

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
