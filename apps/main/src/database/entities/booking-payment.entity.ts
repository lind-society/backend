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
import { Booking } from './booking.entity';
import { Currency } from './currency.entity';

export enum BookingPaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Expired = 'expired',
}

@Entity({ name: 'booking_payments' })
export class BookingPayment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod!: string | null;

  @Column({ name: 'payment_channel', nullable: true })
  paymentChannel!: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount!: number | null;

  @Column({ enum: BookingPaymentStatus, nullable: true })
  status!: BookingPaymentStatus | null;

  @Column({ name: 'paid_at', nullable: true })
  paidAt!: Date | null;

  @Column({ name: 'payment_reference_id', nullable: true })
  paymentReferenceId: string | null;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'booking_id', type: 'uuid', nullable: true })
  bookingId: string | null;

  @ManyToOne(() => Booking, (booking) => booking.payments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

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
