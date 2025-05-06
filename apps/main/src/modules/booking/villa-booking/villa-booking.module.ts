import { VillaBooking } from '@apps/main/database/entities';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../../currency/currency.module';
import { BookingCustomerModule } from '../customer/booking-customer.module';
import { BookingPaymentModule } from '../payment/booking-payment.module';
import { VillaBookingController } from './villa-booking.controller';
import { VillaBookingService } from './villa-booking.service';

@Module({
  controllers: [VillaBookingController],
  providers: [VillaBookingService],
  imports: [
    TypeOrmModule.forFeature([VillaBooking]),
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
    WhatsappClientModule,
  ],
})
export class VillaBookingModule {}
