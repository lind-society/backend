import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/customer.module';
import { BookingPaymentModule } from './payment/payment.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
  ],
})
export class BookingModule {}
