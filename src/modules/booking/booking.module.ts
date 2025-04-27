import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingPaymentModule } from './payment/booking-payment.module';

@Module({
  imports: [BookingPaymentModule, BookingCustomerModule, CurrencyModule],
})
export class BookingModule {}
