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
import { Activity } from './activity.entity';
import { Booking } from './booking.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rating!: number;

  @Column({ type: 'text' })
  message!: string;

  @Column({ name: 'booking_id', type: 'uuid', nullable: true })
  bookingId!: string | null;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId!: string | null;

  @Column({ name: 'villa_id', type: 'uuid', nullable: true })
  villaId!: string | null;

  @OneToOne(() => Booking, (booking) => booking.review, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

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

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
