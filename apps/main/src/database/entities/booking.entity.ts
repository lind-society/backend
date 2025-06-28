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
import { Villa } from './villa.entity';

export enum BookingType {
  Activity = 'activity',
  Villa = 'villa',
}

export enum BookingStatus {
  // Activity
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',

  // Villa
  Requested = 'Requested',
  Negotiation = 'Negotiation',
  WaitingForPayment = 'Waiting for Payment',
  Booked = 'Booked',
  CheckedIn = 'Checked In',
  Done = 'Done',

  // Both
  Canceled = 'Canceled',
}

// Seperate booking status enum for application validation
export enum ActivityBookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export enum VillaBookingStatus {
  Requested = 'Requested',
  Negotiation = 'Negotiation',
  WaitingForPayment = 'Waiting for Payment',
  Booked = 'Booked',
  CheckedIn = 'Checked In',
  Done = 'Done',
  Canceled = 'Canceled',
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: BookingType })
  type!: BookingType;

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

  // Activity Only
  @Column({ name: 'booking_date', type: 'timestamptz', nullable: true })
  bookingDate!: Date;

  // Villa Only
  @Column({ name: 'check_in_date', type: 'timestamptz', nullable: true })
  checkInDate!: Date;

  // Villa Only
  @Column({ name: 'check_out_date', type: 'timestamptz', nullable: true })
  checkOutDate!: Date;

  // Both with different validation each
  @Column({ type: 'enum', enum: BookingStatus, nullable: true })
  status!: ActivityBookingStatus | VillaBookingStatus;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId!: string | null;

  @Column({ name: 'villa_id', type: 'uuid', nullable: true })
  villaId!: string | null;

  @OneToOne(() => Review, (review) => review.booking, {
    nullable: true,
  })
  review?: Review | null;

  @OneToMany(() => BookingPayment, (bookingPayment) => bookingPayment.booking)
  payments: BookingPayment[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency | null;

  @ManyToOne(
    () => BookingCustomer,
    (bookingCustomer) => bookingCustomer.bookings,
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

  @ManyToOne(() => Villa, (villa) => villa.bookings, {
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
