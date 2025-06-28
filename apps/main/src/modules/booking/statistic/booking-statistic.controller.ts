import { SkipHal } from '@apps/main/common/decorators';
import { Controller, Get, Query } from '@nestjs/common';
import { BookingStatisticService } from './booking-statistic.service';
import {
  GetBookingDailyQueryDto,
  GetBookingMonthlyQueryDto,
  GetBookingWithinDateRangeQueryDto,
  GetBookingYearlyQueryDto,
} from './dto/get-booking-statistic.dto';

@SkipHal()
@Controller('bookings/statistics')
export class BookingStatisticController {
  constructor(
    private readonly bookingStatisticService: BookingStatisticService,
  ) {}

  @Get('/daily')
  async getBookingDaily(@Query() query: GetBookingDailyQueryDto) {
    return this.bookingStatisticService.getBookingDaily(query.date, query.type);
  }

  @Get('/monthly')
  async getBookingMonthly(@Query() query: GetBookingMonthlyQueryDto) {
    return this.bookingStatisticService.getBookingMonthly(
      query.month,
      query.year,
      query.type,
    );
  }

  @Get('/yearly')
  async getBookingYearly(@Query() query: GetBookingYearlyQueryDto) {
    return this.bookingStatisticService.getBookingYearly(
      query.year,
      query.type,
    );
  }

  @Get('/date-range')
  async GetBookingWithinDateRange(
    @Query() query: GetBookingWithinDateRangeQueryDto,
  ) {
    return this.bookingStatisticService.getBookingWithinDateRange(
      query.startDate,
      query.endDate,
      query.type,
    );
  }
}
