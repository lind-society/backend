import {
  generateDateRangeWithinDateInterval,
  generateDateRangeWithinOneDay,
  generateMonthDateRange,
  generateYearDateRange,
} from '@apps/main/common/helpers';
import { Booking, BookingType } from '@apps/main/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TotalBookingDto } from './dto';

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

    console.log(startDate);
    console.log(endDate);
    const totalBooking = await this._getBookingWithinDateRange(
      startDate,
      endDate,
      type,
    );

    return {
      date: endDate.toISOString().split('T')[0],
      total: totalBooking,
    };
  }

  async getBookingMonthly(month: number, year?: number, type?: BookingType) {
    const { startDate, endDate } = generateMonthDateRange(month, year);

    const totalBooking = await this._getBookingWithinDateRange(
      startDate,
      endDate,
      type,
    );

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      total: totalBooking,
    };
  }

  async getBookingYearly(year: number, type?: BookingType) {
    const { startDate, endDate } = generateYearDateRange(year);

    const totalBooking = await this._getBookingWithinDateRange(
      startDate,
      endDate,
      type,
    );

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      total: totalBooking,
    };
  }

  async getBookingWithinDateRange(
    startDate: Date | string,
    endDate: Date | string,
    type?: BookingType,
  ) {
    const { startDate: generatedStartDate, endDate: generatedEndDate } =
      generateDateRangeWithinDateInterval(startDate, endDate);

    const totalBooking = await this._getBookingWithinDateRange(
      generatedStartDate,
      generatedEndDate,
      type,
    );

    return {
      startDate: generatedStartDate.toISOString().split('T')[0],
      endDate: generatedEndDate.toISOString().split('T')[0],
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
