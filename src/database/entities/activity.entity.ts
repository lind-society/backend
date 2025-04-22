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
import { ActivityCategory } from './activity-category.entity';
import { Booking } from './booking.entity';
import { Currency } from './currency.entity';
import { Owner } from './owner.entity';
import { Review } from './review.entity';
import { DiscountType } from './shared-enum.entity';
import { PlaceNearby } from './shared-interface.entity';

export enum ActivityDuration {
  Temporary = 'Temporary',
  Permanent = 'Permanent',
}

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'secondary_name' })
  secondaryName!: string;

  @Column({ type: 'text' })
  highlight!: string;

  @Column({
    name: 'price_per_person',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  pricePerPerson!: number | null;

  @Column({
    name: 'price_per_session',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  pricePerSession!: number | null;

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
    name: 'price_per_person_after_discount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    generatedType: 'STORED',
    asExpression: `
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price_per_person - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price_per_person - (price_per_person * COALESCE(discount, 0) / 100), 0)
      END
    `,
    nullable: true,
  })
  pricePerPersonAfterDiscount!: number | null;

  @Column({
    name: 'price_per_session_after_discount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    generatedType: 'STORED',
    asExpression: `
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price_per_session - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price_per_session - (price_per_session * COALESCE(discount, 0) / 100), 0)
      END
    `,
    nullable: true,
  })
  pricePerSessionAfterDiscount!: number | null;

  @Column({ type: 'enum', enum: ActivityDuration })
  duration!: ActivityDuration;

  @Column()
  address!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column({ name: 'postal_code' })
  postalCode!: string;

  @Column({ name: 'map_link' })
  mapLink!: string;

  @Column({
    name: 'place_nearby',
    type: 'jsonb',
  })
  placeNearby!: PlaceNearby[];

  @Column({ name: 'opening_hour', type: 'time', precision: 0 })
  openingHour!: string;

  @Column({ name: 'closing_hour', type: 'time', precision: 0 })
  closingHour!: string;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'text', array: true })
  photos!: string[];

  @Column({ type: 'text', array: true })
  videos!: string[];

  @Column({ name: 'video_360', type: 'text', array: true, nullable: true })
  video360s!: string[] | null;

  @Column({ name: 'floor_plan', type: 'text', array: true, nullable: true })
  floorPlan!: string[] | null;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  averageRating!: number | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ name: 'currency_id', type: 'uuid', nullable: true })
  currencyId: string | null;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string | null;

  @OneToMany(() => Booking, (booking) => booking.activity)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.activity)
  reviews: Review[];

  @ManyToOne(() => ActivityCategory, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category!: ActivityCategory | null;

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency | null;

  @ManyToOne(() => Owner, (owner) => owner.activities, {
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
