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
import { BookingPaymentRefund } from './booking-payment-refund.entity';
import { Booking } from './booking.entity';
import { Currency } from './currency.entity';

export enum BookingPaymentAvailableStatus {
  RequiresAction = 'requires_action',
  Active = 'active',
  Pending = 'pending',
  Paid = 'paid',
  Expired = 'expired',
  Authorized = 'authorized',
  WaitingForRefund = 'waiting_for_refund',
  Refunded = 'refunded',
  Canceled = 'cancelled',
  Failed = 'failed',
}

export enum BookingPaymentFailureStage {
  CreatePaymentInvoice = 'create_payment_invoice',
  PayPaymentInvoice = 'pay_payment_invoice',

  CreatePaymentRequest = 'create_payment_request',
  PayPaymentRequest = 'pay_payment_request',
  CancelPaymentRequest = 'cancel_payment_request',

  CreatePaymentSession = 'create_payment_session',
  PayPaymentSession = 'pay_payment_session',
  CancelPaymentSession = 'cancel_payment_session',

  PaymentRefundRequest = 'payment_refund_request',
  PaymentRefundResult = 'payment_refund_result',

  CancelPayment = 'cancel_payment',
  CapturePayment = 'capture_payment',

  CreatePaymentToken = 'create_payment_token',
  PaymentTokenActivation = 'payment_token_activation', // or payment token result
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

  @Column({ type: 'enum', enum: BookingPaymentAvailableStatus, nullable: true })
  status!: BookingPaymentAvailableStatus | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt!: Date | null;

  @Column({ name: 'refunded_at', type: 'timestamptz', nullable: true })
  refundedAt!: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt!: Date | null;

  @Column({
    name: 'failure_stage',
    type: 'enum',
    enum: BookingPaymentFailureStage,
    nullable: true,
  })
  failureStage: BookingPaymentFailureStage | null;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string | null;

  @Column({
    name: 'refunded_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  refundedAmount!: number | null;

  @Column({ name: 'refunded_reason', nullable: true })
  refundedReason: string | null;

  @Column({ name: 'cancelled_reason', nullable: true })
  cancelledReason: string | null;

  @Column({ name: 'payment_reference_id', nullable: true })
  paymentReferenceId: string | null;

  @Column({ name: 'payment_request_reference_id', nullable: true })
  paymentRequestReferenceId: string | null;

  @Column({ name: 'payment_session_reference_id', nullable: true })
  paymentSessionReferenceId: string | null;

  @Column({ name: 'payment_token_reference_id', nullable: true })
  paymentTokenReferenceId: string | null;

  @Column({ name: 'payment_refund_reference_id', nullable: true })
  paymentRefundReferenceId: string | null;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string;

  @Column({ name: 'booking_id', type: 'uuid' })
  bookingId: string;

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

  @OneToMany(
    () => BookingPaymentRefund,
    (bookingPaymentRefund) => bookingPaymentRefund.bookingPayment,
  )
  refundHistories: BookingPaymentRefund[];

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
