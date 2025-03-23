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
import { BookingCustomer } from './booking-customer.entity';
import { BookingPayment } from './booking-payment.entity';
import { Currency } from './currency.entity';

@Entity({ name: 'bookings' })
export class Booking {
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
    nullable: true,
  })
  totalAmount!: number;

  @Column({ name: 'check_in_date', type: 'timestamptz', nullable: true })
  checkInDate!: Date | null;

  @Column({ name: 'check_out_date', type: 'timestamptz', nullable: true })
  checkOutDate!: Date | null;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId!: string | null;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string | null;

  @OneToMany(() => BookingPayment, (bookingPayment) => bookingPayment.booking)
  payments: BookingPayment[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

  @ManyToOne(
    () => BookingCustomer,
    (bookingCustomer) => bookingCustomer.bookings,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'customer_id' })
  customer!: BookingCustomer;

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
