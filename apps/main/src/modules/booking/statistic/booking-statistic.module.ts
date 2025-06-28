import { Booking } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingStatisticController } from './booking-statistic.controller';
import { BookingStatisticService } from './booking-statistic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingStatisticController],
  providers: [BookingStatisticService],
  exports: [BookingStatisticService],
})
export class BookingStatisticModule {}
