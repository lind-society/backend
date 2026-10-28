import {
  Booking,
  Villa,
  VillaDailyRate,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, In, Repository } from 'typeorm';
import { OCCUPYING_VILLA_BOOKING_STATUSES } from '../../booking/helper/booking-status.helper';
import {
  ClearVillaDailyRatesDto,
  UpsertVillaDailyRatesDto,
  VillaCalendarDayDto,
} from './dto';

/** `2026-09-07` — the calendar's unit, independent of any timezone. */
export const toDateKey = (value: Date | string): string =>
  typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10);

/** Every date from `from` to `to`, inclusive. */
export const eachDateKey = (from: string, to: string): string[] => {
  const keys: string[] = [];
  const cursor = new Date(`${toDateKey(from)}T00:00:00Z`);
  const last = new Date(`${toDateKey(to)}T00:00:00Z`);

  while (cursor <= last) {
    keys.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return keys;
};

@Injectable()
export class VillaDailyRateService {
  private readonly logger = new Logger(VillaDailyRateService.name);

  constructor(
    @InjectRepository(VillaDailyRate)
    private readonly dailyRateRepository: Repository<VillaDailyRate>,
    @InjectRepository(Villa)
    private readonly villaRepository: Repository<Villa>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  /**
   * The calendar the admin sees: one entry per day in the window, already
   * resolved through override -> season -> tier, and flagged where a night is
   * spoken for by a live booking.
   */
  async getCalendar(
    villaId: string,
    from: string,
    to: string,
  ): Promise<VillaCalendarDayDto[]> {
    const villa = await this.villaRepository.findOne({
      where: { id: villaId },
      relations: { villaPriceRules: { priceRule: true } },
    });

    if (!villa) {
      throw new NotFoundException('villa not found');
    }

    const dates = eachDateKey(from, to);

    const overrides = await this.dailyRateRepository.find({
      where: { villaId, date: Between(toDateKey(from), toDateKey(to)) },
    });
    const overrideByDate = new Map(overrides.map((row) => [toDateKey(row.date), row]));

    const bookedDates = await this._getBookedDates(villaId, from, to);

    const activeRules = (villa.villaPriceRules ?? [])
      .map((pivot) => pivot.priceRule)
      .filter((rule) => rule && rule.isActive);

    return dates.map((date) => {
      const override = overrideByDate.get(date);

      // Rules are sorted so the most specific (shortest) window wins, matching
      // how a peak-season week inside a high-season month should behave.
      const rule = activeRules
        .filter(
          (candidate) =>
            toDateKey(candidate.startDate) <= date &&
            date <= toDateKey(candidate.endDate),
        )
        .sort(
          (a, b) =>
            this._spanDays(a.startDate, a.endDate) -
            this._spanDays(b.startDate, b.endDate),
        )[0];

      const season = rule?.season ?? VillaPriceRuleSeason.Regular_Season;
      const seasonPrice = this._seasonRate(villa, season);

      const overridePrice =
        override?.price != null ? Number(override.price) : null;

      return {
        date,
        price: overridePrice ?? seasonPrice.price,
        source: overridePrice != null ? 'override' : seasonPrice.source,
        season,
        priceRuleName: rule?.name ?? null,
        minStay: override?.minStay ?? null,
        isBlocked: override?.isBlocked ?? false,
        note: override?.note ?? null,
        isBooked: bookedDates.has(date),
      } satisfies VillaCalendarDayDto;
    });
  }

  /**
   * Applies one set of values to many dates.
   *
   * Only the fields present in the payload are written, so an admin who selects
   * a week and sets just a minimum stay does not silently wipe the prices that
   * were already on those days.
   */
  async upsert(
    villaId: string,
    payload: UpsertVillaDailyRatesDto,
  ): Promise<VillaDailyRate[]> {
    await this._assertVillaExists(villaId);

    const dates = [...new Set(payload.dates.map(toDateKey))].sort();

    if (!dates.length) {
      return [];
    }

    const existing = await this.dailyRateRepository.find({
      where: { villaId, date: In(dates) },
    });
    const existingByDate = new Map(existing.map((row) => [toDateKey(row.date), row]));

    const rows = dates.map((date) => {
      const current = existingByDate.get(date);

      const next = this.dailyRateRepository.create({
        ...(current ?? {}),
        villaId,
        date,
      });

      if ('price' in payload) next.price = payload.price ?? null;
      if ('minStay' in payload) next.minStay = payload.minStay ?? null;
      if ('isBlocked' in payload) next.isBlocked = payload.isBlocked ?? false;
      if ('note' in payload) next.note = payload.note ?? null;

      return next;
    });

    const saved = await this.dailyRateRepository.save(rows);

    this.logger.log(
      `villa ${villaId}: applied calendar values to ${saved.length} date(s)`,
    );

    return saved;
  }

  /** Drops the overrides so the dates fall back to their season again. */
  async clear(
    villaId: string,
    payload: ClearVillaDailyRatesDto,
  ): Promise<{ cleared: number }> {
    await this._assertVillaExists(villaId);

    const dates = [...new Set(payload.dates.map(toDateKey))];

    if (!dates.length) {
      return { cleared: 0 };
    }

    const result = await this.dailyRateRepository.delete({
      villaId,
      date: In(dates),
    });

    return { cleared: result.affected ?? 0 };
  }

  /**
   * Overrides for a stay, keyed by date. Used by the booking pricing and
   * availability checks, which run per night.
   */
  async getOverridesForRange(
    villaId: string,
    from: Date | string,
    to: Date | string,
    entityManager?: EntityManager,
  ): Promise<Map<string, VillaDailyRate>> {
    const repository = entityManager
      ? entityManager.getRepository(VillaDailyRate)
      : this.dailyRateRepository;

    const rows = await repository.find({
      where: { villaId, date: Between(toDateKey(from), toDateKey(to)) },
    });

    return new Map(rows.map((row) => [toDateKey(row.date), row]));
  }

  private async _assertVillaExists(villaId: string): Promise<void> {
    const exists = await this.villaRepository.exists({ where: { id: villaId } });

    if (!exists) {
      throw new NotFoundException('villa not found');
    }
  }

  /** Nights already committed to a booking, so the calendar can grey them out. */
  private async _getBookedDates(
    villaId: string,
    from: string,
    to: string,
  ): Promise<Set<string>> {
    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .select(['booking.id', 'booking.checkInDate', 'booking.checkOutDate'])
      .where('booking.villa_id = :villaId', { villaId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: OCCUPYING_VILLA_BOOKING_STATUSES,
      })
      .andWhere('booking.check_in_date < :to', { to: toDateKey(to) })
      .andWhere('booking.check_out_date > :from', { from: toDateKey(from) })
      .getMany();

    const booked = new Set<string>();

    for (const booking of bookings) {
      if (!booking.checkInDate || !booking.checkOutDate) continue;

      // Check-out day is free for the next guest, so the last night is the day
      // before check-out.
      const nights = eachDateKey(
        toDateKey(booking.checkInDate),
        toDateKey(new Date(new Date(booking.checkOutDate).getTime() - 86400000)),
      );

      nights.forEach((night) => booked.add(night));
    }

    return booked;
  }

  private _spanDays(start: Date | string, end: Date | string): number {
    return (
      new Date(toDateKey(end)).getTime() - new Date(toDateKey(start)).getTime()
    );
  }

  private _seasonRate(
    villa: Villa,
    season: VillaPriceRuleSeason,
  ): { price: number; source: 'season' | 'base' } {
    const bySeason: Record<VillaPriceRuleSeason, number | null> = {
      [VillaPriceRuleSeason.Regular_Season]: villa.dailyPrice,
      [VillaPriceRuleSeason.Low_Season]: villa.lowSeasonDailyPrice,
      [VillaPriceRuleSeason.High_Season]: villa.highSeasonDailyPrice,
      [VillaPriceRuleSeason.Peak_Season]: villa.peakSeasonDailyPrice,
    };

    const seasonal = bySeason[season];

    if (seasonal != null && Number(seasonal) > 0) {
      return {
        price: Number(seasonal),
        source: season === VillaPriceRuleSeason.Regular_Season ? 'base' : 'season',
      };
    }

    // A season with no rate of its own falls back to the regular daily rate,
    // the same way the booking pricing does.
    return { price: Number(villa.dailyPrice ?? 0), source: 'base' };
  }
}
