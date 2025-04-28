import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityBooking } from 'src/database/entities';
import { CurrencyModule } from '../../currency/currency.module';
import { WhatsappModule } from '../../shared/whatsapp/whatsapp.module';
import { BookingCustomerModule } from '../customer/booking-customer.module';
import { BookingPaymentModule } from '../payment/booking-payment.module';
import { ActivityBookingController } from './activity-booking.controller';
import { ActivityBookingService } from './activity-booking.service';

@Module({
  controllers: [ActivityBookingController],
  providers: [ActivityBookingService],
  imports: [
    TypeOrmModule.forFeature([ActivityBooking]),
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
    WhatsappModule,
  ],
})
export class ActivityBookingModule {}
