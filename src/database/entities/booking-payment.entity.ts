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
  currencyId!: string | null;

  @Column({ name: 'booking_id', type: 'uuid' })
  bookingId: string;

  @ManyToOne(() => Booking, (booking) => booking.payments)
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
