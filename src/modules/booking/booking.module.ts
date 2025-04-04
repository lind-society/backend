import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { WhatsappModule } from '../shared/whatsapp/whatsapp.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingPaymentModule } from './payment/booking-payment.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
    WhatsappModule,
  ],
})
export class BookingModule {}
