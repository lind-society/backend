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
import { Activity } from './activity.entity';
import { Property } from './property.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // name, country, check in, and checkot filled from booking with status finish
  @Column({ nullable: true })
  name!: string | null;

  @Column({ nullable: true })
  country!: string | null;

  @Column({ name: 'check_in', type: 'timestamptz', nullable: true })
  checkIn!: Date | null;

  @Column({ name: 'check_out', type: 'timestamptz', nullable: true })
  checkOut!: Date | null;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rating!: number;

  @Column({ type: 'text' })
  message!: string;

  // purpose : get customer data who rent or buy villa and property (get from bookingId, currently nullable since booking not created)
  @Column({ name: 'booking_id', type: 'uuid', nullable: true })
  bookingId!: string | null;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId!: string | null;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId!: string | null;

  @Column({ name: 'villa_id', type: 'uuid', nullable: true })
  villaId!: string | null;

  @ManyToOne(() => Activity, (activity) => activity.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'activity_id' })
  activity!: Activity | null;

  @ManyToOne(() => Property, (property) => property.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'property_id' })
  property!: Property | null;

  @ManyToOne(() => Villa, (villa) => villa.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa | null;

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
