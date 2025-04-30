import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { ActivityBookingModule } from './activity-booking/activity-booking.module';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingPaymentModule } from './payment/booking-payment.module';
import { VillaBookingModule } from './villa-booking/villa-booking.module';

@Module({
  imports: [
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
    ActivityBookingModule,
    VillaBookingModule,
  ],
})
export class BookingModule {}
