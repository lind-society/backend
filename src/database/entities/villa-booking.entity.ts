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
import { BookingCustomer } from './booking-customer.entity';
import { BookingPayment } from './booking-payment.entity';
import { Currency } from './currency.entity';
import { Review } from './review.entity';
import { Villa } from './villa.entity';

export enum VillaBookingStatus {
  Requested = 'Requested',
  Negotiation = 'Negotiation',
  WaitingForPayment = 'Waiting for Payment',
  Booked = 'Booked',
  CheckedIn = 'Checked In',
  Done = 'Done',
  Canceled = 'Canceled',
}

@Entity({ name: 'villa_bookings' })
export class VillaBooking {
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

  @Column({ name: 'check_in_date', type: 'timestamptz' })
  checkInDate!: Date;

  @Column({ name: 'check_out_date', type: 'timestamptz' })
  checkOutDate!: Date;

  @Column({ type: 'enum', enum: VillaBookingStatus })
  status!: VillaBookingStatus;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'villa_id', type: 'uuid', nullable: true })
  villaId!: string | null;

  @OneToOne(() => Review, (review) => review.villaBooking, {
    nullable: true,
  })
  review?: Review;

  @OneToMany(
    () => BookingPayment,
    (bookingPayment) => bookingPayment.villaBooking,
  )
  payments: BookingPayment[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

  @ManyToOne(
    () => BookingCustomer,
    (bookingCustomer) => bookingCustomer.villaBookings,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'customer_id' })
  customer!: BookingCustomer;

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
