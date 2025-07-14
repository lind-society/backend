import { Booking } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHelperService } from './booking-helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingHelperService],
  exports: [BookingHelperService],
})
export class BookingHelperModule {}
