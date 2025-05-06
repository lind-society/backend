import { Activity, ActivityBooking } from '@apps/main/database/entities';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../../currency/currency.module';
import { BookingCustomerModule } from '../customer/booking-customer.module';
import { BookingPaymentModule } from '../payment/booking-payment.module';
import { ActivityBookingController } from './activity-booking.controller';
import { ActivityBookingService } from './activity-booking.service';

@Module({
  controllers: [ActivityBookingController],
  providers: [ActivityBookingService],
  imports: [
    TypeOrmModule.forFeature([Activity, ActivityBooking]),
    BookingPaymentModule,
    BookingCustomerModule,
    CurrencyModule,
    WhatsappClientModule,
  ],
  exports: [ActivityBookingService],
})
export class ActivityBookingModule {}
