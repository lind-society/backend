import {
  generateDateRangeWithinDateInterval,
  generateDateRangeWithinOneDay,
  generateMonthDateRange,
} from '@apps/main/common/helpers';
import { Booking, BookingType } from '@apps/main/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TotalBookingDto,
  TotalBookingPerMonthDto,
  TotalBookingPerYearDto,
} from './dto';

/**
 * Format a Date as `YYYY-MM-DD` in the server's local timezone.
 *
 * The range helpers build boundaries with `new Date(year, month, day)`, i.e. in
 * local time. Reporting those back with `toISOString()` shifted them by the UTC
 * offset — in WIB (UTC+7), the range for August was reported as starting
 * 2026-07-31. `sv-SE` yields ISO-shaped output without that shift, and matches
 * what getBookingYearly already does.
 */
const toLocalDateString = (date: Date): string =>
  date.toLocaleDateString('sv-SE');

@Injectable()
export class BookingStatisticService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getBookingDaily(
    date?: Date | string,
    type?: BookingType,
  ): Promise<TotalBookingDto> {
    const { startDate, endDate } = date
      ? generateDateRangeWithinOneDay(date)
      : generateDateRangeWithinOneDay(new Date());

    const totalBooking = await this._getBookingWithinDateRange(
      startDate,
      endDate,
      type,
    );

    return {
      date: toLocalDateString(endDate),
      total: totalBooking,
    };
  }

  async getBookingMonthly(
    month: number,
    year?: number,
    type?: BookingType,
  ): Promise<TotalBookingDto> {
    const { startDate, endDate } = generateMonthDateRange(month, year);

    const totalBooking = await this._getBookingWithinDateRange(
      startDate,
      endDate,
      type,
    );

    return {
      startDate: toLocalDateString(startDate),
      endDate: toLocalDateString(endDate),
      total: totalBooking,
    };
  }

  async getBookingYearly(
    year: number,
    type?: BookingType,
  ): Promise<TotalBookingPerYearDto> {
    const monthlyStats: TotalBookingPerMonthDto[] = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1, 0, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // last day of the month

      const totalBooking = await this._getBookingWithinDateRange(
        startDate,
        endDate,
        type,
      );

      monthlyStats.push({
        month: month + 1,
        monthName: startDate.toLocaleString('en-US', { month: 'long' }),
        startDate: startDate.toLocaleDateString('sv-SE').split('T')[0],
        endDate: endDate.toLocaleDateString('sv-SE').split('T')[0],
        total: totalBooking,
      });
    }

    return {
      year,
      totalPerMonth: monthlyStats,
      totalPerYear: monthlyStats.reduce((sum, month) => sum + month.total, 0),
    };
  }

  async getBookingWithinDateRange(
    startDate: Date | string,
    endDate: Date | string,
    type?: BookingType,
  ): Promise<TotalBookingDto> {
    const { startDate: generatedStartDate, endDate: generatedEndDate } =
      generateDateRangeWithinDateInterval(startDate, endDate);

    const totalBooking = await this._getBookingWithinDateRange(
      generatedStartDate,
      generatedEndDate,
      type,
    );

    return {
      startDate: toLocalDateString(generatedStartDate),
      endDate: toLocalDateString(generatedEndDate),
      total: totalBooking,
    };
  }

  async _getBookingWithinDateRange(
    startDate: Date | string,
    endDate: Date | string,
    type?: BookingType,
  ) {
    const qb = this.bookingRepository.createQueryBuilder('bookings');

    const dateCondition = `
    bookings.bookingDate BETWEEN :startDate AND :endDate
    OR bookings.checkInDate BETWEEN :startDate AND :endDate
    OR bookings.checkOutDate BETWEEN :startDate AND :endDate
    `;

    qb.where(`(${dateCondition})`, { startDate, endDate });

    if (type) {
      qb.andWhere('bookings.type = :type', { type });
    }

    return await qb.getCount();
  }
}
