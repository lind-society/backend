import { Activity, Booking } from '@apps/main/database/entities';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPaymentModule } from '../booking-payment/booking-payment.module';
import { CurrencyModule } from '../currency/currency.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingHelperService } from './helper/booking-helper.service';
import { BookingStatisticModule } from './statistic/booking-statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Booking]),
    BookingCustomerModule,
    BookingPaymentModule,
    BookingStatisticModule,
    CurrencyModule,
    PaymentModule,
    WhatsappClientModule,
  ],
  providers: [BookingService, BookingHelperService],
  controllers: [BookingController],
  exports: [BookingService, BookingHelperService],
})
export class BookingModule {}
