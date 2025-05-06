import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { BookingCustomer } from './booking-customer.entity';
import { BookingPayment } from './booking-payment.entity';
import { Currency } from './currency.entity';
import { Review } from './review.entity';

export enum ActivityBookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

@Entity({ name: 'activity_bookings' })
export class ActivityBooking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'total_guest',
    type: 'integer',
  })
  totalGuest!: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalAmount!: number;

  @Column({ name: 'booking_date', type: 'timestamptz' })
  bookingDate!: Date;

  @Column({ type: 'enum', enum: ActivityBookingStatus })
  status!: ActivityBookingStatus;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId!: string | null;

  @OneToOne(() => Review, (review) => review.activityBooking, {
    nullable: true,
  })
  review?: Review | null;

  @OneToMany(
    () => BookingPayment,
    (bookingPayment) => bookingPayment.activityBooking,
  )
  payments: BookingPayment[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency | null;

  @ManyToOne(
    () => BookingCustomer,
    (bookingCustomer) => bookingCustomer.activityBookings,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'customer_id' })
  customer!: BookingCustomer | null;

  @ManyToOne(() => Activity, (activity) => activity.bookings, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'activity_id' })
  activity!: Activity | null;

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
