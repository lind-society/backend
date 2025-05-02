import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityBooking } from './activity-booking.entity';
import { Activity } from './activity.entity';
import { VillaBooking } from './villa-booking.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rating!: number;

  @Column({ type: 'text' })
  message!: string;

  @Column({ name: 'activity_booking_id', type: 'uuid', nullable: true })
  activityBookingId!: string | null;

  @Column({ name: 'villa_booking_id', type: 'uuid', nullable: true })
  villaBookingId!: string | null;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId!: string | null;

  @Column({ name: 'villa_id', type: 'uuid', nullable: true })
  villaId!: string | null;

  @OneToOne(
    () => ActivityBooking,
    (activityBooking) => activityBooking.review,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'activity_booking_id' })
  activityBooking: ActivityBooking;

  @OneToOne(() => VillaBooking, (villaBooking) => villaBooking.review, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'villa_booking_id' })
  villaBooking: VillaBooking;

  @ManyToOne(() => Activity, (activity) => activity.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'activity_id' })
  activity!: Activity | null;

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
