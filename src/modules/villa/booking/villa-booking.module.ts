import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaBooking } from 'src/database/entities';
import { BookingCustomerModule } from '../../booking/customer/booking-customer.module';
import { BookingPaymentModule } from '../../booking/payment/booking-payment.module';
import { CurrencyModule } from '../../currency/currency.module';
import { WhatsappModule } from '../../shared/whatsapp/whatsapp.module';
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
    WhatsappModule,
  ],
})
export class VillaBookingModule {}
