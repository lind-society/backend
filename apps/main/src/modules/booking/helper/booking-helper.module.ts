import {
  Activity,
  Booking,
  Villa,
  VillaDailyRate,
} from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingAccessService } from './booking-access.service';
import { BookingAvailabilityService } from './booking-availability.service';
import { BookingHelperService } from './booking-helper.service';
import { BookingPriceService } from './booking-price.service';

/**
 * Stateless booking rules shared by the booking and booking-payment modules:
 * link access, calendar occupancy and server-side pricing.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Booking, Villa, VillaDailyRate]),
  ],
  providers: [
    BookingAccessService,
    BookingAvailabilityService,
    BookingHelperService,
    BookingPriceService,
  ],
  exports: [
    BookingAccessService,
    BookingAvailabilityService,
    BookingHelperService,
    BookingPriceService,
  ],
})
export class BookingHelperModule {}
