import { constructReadableDate } from '@apps/main/common/helpers';
import { Booking, VillaDailyRate } from '@apps/main/database/entities';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';
import {
  eachDateKey,
  toDateKey,
} from '../../villa/daily-rate/villa-daily-rate.service';
import { OCCUPYING_VILLA_BOOKING_STATUSES } from './booking-status.helper';

/**
 * Villas have no availability calendar of their own — occupancy is derived from
 * the bookings themselves. Inquiries do not reserve dates (availability is still
 * being confirmed with the owner by hand); only bookings the admin has already
 * committed to do.
 */
@Injectable()
export class BookingAvailabilityService {
  private readonly logger = new Logger(BookingAvailabilityService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(VillaDailyRate)
    private villaDailyRateRepository: Repository<VillaDailyRate>,
  ) {}

  /**
   * Rejects the change when the villa is already committed to overlapping
   * dates. Two stays touching at the edges (check-out on the same day as the
   * next check-in) is not an overlap.
   */
  async assertVillaAvailable(
    villaId: string,
    checkInDate: Date | string,
    checkOutDate: Date | string,
    excludeBookingId?: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    // The calendar can close dates that no booking occupies — maintenance, the
    // owner's own stay, or a booking taken on another channel.
    await this.assertCalendarAllows(
      villaId,
      checkInDate,
      checkOutDate,
      entityManager,
    );

    const conflicts = await this.findConflictingBookings(
      villaId,
      checkInDate,
      checkOutDate,
      excludeBookingId,
      entityManager,
    );

    if (!conflicts.length) {
      return;
    }

    const [conflict] = conflicts;

    throw new ConflictException(
      `villa is not available for the selected dates, it is already booked from ${constructReadableDate(
        new Date(conflict.checkInDate),
      )} to ${constructReadableDate(new Date(conflict.checkOutDate))}`,
    );
  }

  /**
   * Enforces the pricing calendar's own rules: blocked nights, and a minimum
   * stay attached to the arrival date.
   *
   * Minimum stay is read from the check-in date only. Reading it from every
   * night would make a single long-weekend rule reject stays that merely pass
   * through it, which is not what "minimum stay" means to a host.
   */
  async assertCalendarAllows(
    villaId: string,
    checkInDate: Date | string,
    checkOutDate: Date | string,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (!villaId || !checkInDate || !checkOutDate) {
      return;
    }

    const checkIn = toDateKey(checkInDate);
    const checkOut = toDateKey(checkOutDate);

    // The check-out day is not slept in, so it is not part of the stay.
    const lastNight = toDateKey(
      new Date(new Date(`${checkOut}T00:00:00Z`).getTime() - 86400000),
    );

    if (lastNight < checkIn) {
      return;
    }

    const repository = entityManager
      ? entityManager.getRepository(VillaDailyRate)
      : this.villaDailyRateRepository;

    const rows = await repository.find({
      where: { villaId, date: Between(checkIn, lastNight) },
    });

    const byDate = new Map(rows.map((row) => [toDateKey(row.date), row]));

    const blocked = eachDateKey(checkIn, lastNight).filter(
      (date) => byDate.get(date)?.isBlocked,
    );

    if (blocked.length) {
      throw new ConflictException(
        `villa is not available on ${blocked.join(', ')}`,
      );
    }

    const minStay = byDate.get(checkIn)?.minStay;
    const nights = eachDateKey(checkIn, lastNight).length;

    if (minStay && nights < minStay) {
      throw new ConflictException(
        `this arrival date requires a minimum stay of ${minStay} night(s), got ${nights}`,
      );
    }
  }

  async findConflictingBookings(
    villaId: string,
    checkInDate: Date | string,
    checkOutDate: Date | string,
    excludeBookingId?: string,
    entityManager?: EntityManager,
  ): Promise<Booking[]> {
    if (!villaId || !checkInDate || !checkOutDate) {
      return [];
    }

    const query = this._getRepository(entityManager)
      .createQueryBuilder('booking')
      .select([
        'booking.id',
        'booking.status',
        'booking.checkInDate',
        'booking.checkOutDate',
      ])
      .where('booking.villaId = :villaId', { villaId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: OCCUPYING_VILLA_BOOKING_STATUSES,
      })
      // Half-open interval [checkIn, checkOut): a stay ending on the day another
      // one starts does not collide.
      .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('booking.checkOutDate > :checkInDate', { checkInDate });

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    return await query.getMany();
  }

  private _getRepository(entityManager?: EntityManager): Repository<Booking> {
    return entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;
  }
}
