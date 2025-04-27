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
import { ActivityBooking } from './activity-booking.entity';
import { Currency } from './currency.entity';
import { VillaBooking } from './villa-booking.entity';

@Entity({ name: 'booking_payments' })
export class BookingPayment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  paymentMethod!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount!: number;

  @Column()
  status!: string;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'activity_booking_id', type: 'uuid', nullable: true })
  activityBookingId: string | null;

  @Column({ name: 'villa_booking_id', type: 'uuid', nullable: true })
  villaBookingId: string | null;

  @ManyToOne(
    () => ActivityBooking,
    (activityBooking) => activityBooking.payments,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'activity_booking_id' })
  activityBooking: ActivityBooking;

  @ManyToOne(() => VillaBooking, (villaBooking) => villaBooking.payments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'villa_booking_id' })
  villaBooking: VillaBooking;

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

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
