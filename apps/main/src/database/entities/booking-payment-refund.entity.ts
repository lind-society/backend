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
import { BookingPayment } from './booking-payment.entity';
import { Currency } from './currency.entity';

export enum BookingPaymentRefundStatus {
  Succeeded = 'succeeded',
  Failed = 'failed',
  Pending = 'pending',
  Cancelled = 'cancelled',
}

@Entity({ name: 'booking_payment_refunds' })
export class BookingPaymentRefund {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount!: number | null;

  @Column({ name: 'refunded_reason' })
  reason: string;

  @Column({ type: 'enum', enum: BookingPaymentRefundStatus })
  status!: BookingPaymentRefundStatus;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string | null;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'booking_payment_id', type: 'uuid' })
  bookingPaymentId: string;

  @Column({ name: 'payment_refund_request_reference_id' })
  paymentRefundRequestReferenceId: string;

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

  @ManyToOne(
    () => BookingPayment,
    (bookingPayment) => bookingPayment.refundHistories,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'booking_payment_id' })
  bookingPayment: BookingPayment;

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
