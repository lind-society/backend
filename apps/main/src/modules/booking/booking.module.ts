import { Activity, Booking } from '@apps/main/database/entities';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingPaymentModule } from './payment/booking-payment.module';
import { BookingStatisticModule } from './statistic/booking-statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Booking]),
    BookingCustomerModule,
    BookingPaymentModule,
    BookingStatisticModule,
    CurrencyModule,
    WhatsappClientModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
