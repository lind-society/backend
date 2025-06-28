import { SkipHal } from '@apps/main/common/decorators';
import { Controller, Get, Query } from '@nestjs/common';
import { BookingStatisticService } from './booking-statistic.service';
import {
  GetBookingDailySuccessResponse,
  GetBookingDateRangeSuccessResponse,
  GetBookingYearlySuccessResponse,
} from './dto';
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
    const result = await this.bookingStatisticService.getBookingDaily(
      query.date,
      query.type,
    );

    return new GetBookingDailySuccessResponse(result);
  }

  @Get('/monthly')
  async getBookingMonthly(@Query() query: GetBookingMonthlyQueryDto) {
    const result = await this.bookingStatisticService.getBookingMonthly(
      query.month,
      query.year,
      query.type,
    );

    return new GetBookingDateRangeSuccessResponse(result, 'monthly');
  }

  @Get('/yearly')
  async getBookingYearly(@Query() query: GetBookingYearlyQueryDto) {
    const result = await this.bookingStatisticService.getBookingYearly(
      query.year,
      query.type,
    );

    return new GetBookingYearlySuccessResponse(result);
  }

  @Get('/date-range')
  async GetBookingWithinDateRange(
    @Query() query: GetBookingWithinDateRangeQueryDto,
  ) {
    const result = await this.bookingStatisticService.getBookingWithinDateRange(
      query.startDate,
      query.endDate,
      query.type,
    );

    return new GetBookingDateRangeSuccessResponse(result, 'date range');
  }
}
