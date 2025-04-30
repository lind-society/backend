import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityBooking } from './activity-booking.entity';
import { VillaBooking } from './villa-booking.entity';

@Entity({ name: 'booking_customers' })
export class BookingCustomer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ name: 'phone_country_code' })
  phoneCountryCode!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @OneToMany(
    () => ActivityBooking,
    (activityBooking) => activityBooking.customer,
  )
  activityBookings!: ActivityBooking[];

  @OneToMany(() => VillaBooking, (villaBooking) => villaBooking.customer)
  villaBookings!: VillaBooking[];

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
