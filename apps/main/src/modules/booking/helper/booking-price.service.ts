import {
  Activity,
  Villa,
  VillaDailyRate,
  VillaPriceRule,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';
import { toDateKey } from '../../villa/daily-rate/villa-daily-rate.service';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export interface BookingPriceBreakdownNight {
  date: Date;
  season: VillaPriceRuleSeason;
  amount: number;
}

export interface BookingPriceResult {
  totalAmount: number;
  currencyId: string;
  nights: number;
  nightlyBreakdown: BookingPriceBreakdownNight[];
}

/**
 * Prices a booking on the server.
 *
 * The amount a guest sends from the browser is a display value, never a source
 * of truth: it decides how much the payment gateway will collect and whether a
 * booking counts as fully paid, so it has to be recomputed here.
 *
 * Nightly rates are read from the villa's stored `*_after_discount` columns,
 * which `VillaPriceService` already keeps in sync with the active price rules —
 * this service only decides *which* season applies to each night.
 */
@Injectable()
export class BookingPriceService {
  private readonly logger = new Logger(BookingPriceService.name);

  constructor(
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(VillaDailyRate)
    private villaDailyRateRepository: Repository<VillaDailyRate>,
  ) {}

  async calculateVillaBooking(
    villaId: string,
    checkInDate: Date | string,
    checkOutDate: Date | string,
    entityManager?: EntityManager,
  ): Promise<BookingPriceResult> {
    const villa = await this._getVillaRepository(entityManager).findOne({
      where: { id: villaId },
      relations: { villaPriceRules: { priceRule: true } },
    });

    if (!villa) {
      throw new NotFoundException('villa not found');
    }

    if (!villa.currencyId) {
      throw new BadRequestException(
        'villa has no currency configured, cannot price this booking',
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = this._countNights(checkIn, checkOut);

    const activeRules = (villa.villaPriceRules ?? [])
      .map((pivot) => pivot.priceRule)
      .filter((rule): rule is VillaPriceRule => Boolean(rule) && rule.isActive);

    // Per-date overrides from the pricing calendar. They win over the season
    // tiers, matching how hosts expect a hand-set holiday rate to behave.
    const overrides = await this._getDailyOverrides(
      villaId,
      checkIn,
      checkOut,
      entityManager,
    );

    const nightlyBreakdown: BookingPriceBreakdownNight[] = [];

    for (let offset = 0; offset < nights; offset++) {
      const night = new Date(checkIn.getTime() + offset * MILLISECONDS_PER_DAY);
      const season = this._resolveSeason(activeRules, night);
      const override = overrides.get(toDateKey(night));
      const amount =
        override?.price != null
          ? Number(override.price)
          : this._resolveNightlyRate(villa, season);

      if (amount <= 0) {
        throw new BadRequestException(
          `villa has no ${season.replace('_', ' ')} daily price configured, cannot price this booking`,
        );
      }

      nightlyBreakdown.push({ date: night, season, amount });
    }

    const totalAmount = this._round(
      nightlyBreakdown.reduce((sum, night) => sum + night.amount, 0),
    );

    return {
      totalAmount,
      currencyId: villa.currencyId,
      nights,
      nightlyBreakdown,
    };
  }

  /**
   * Activities are priced per booking, not per guest — the same assumption the
   * public catalogue makes when it renders a price with no unit.
   */
  async calculateActivityBooking(
    activityId: string,
    entityManager?: EntityManager,
  ): Promise<BookingPriceResult> {
    const activity = await this._getActivityRepository(entityManager).findOne({
      where: { id: activityId },
      select: {
        id: true,
        price: true,
        priceAfterDiscount: true,
        currencyId: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    if (!activity.currencyId) {
      throw new BadRequestException(
        'activity has no currency configured, cannot price this booking',
      );
    }

    const amount = this._round(
      this._toNumber(activity.priceAfterDiscount) ||
        this._toNumber(activity.price),
    );

    if (amount <= 0) {
      throw new BadRequestException(
        'activity has no price configured, cannot price this booking',
      );
    }

    return {
      totalAmount: amount,
      currencyId: activity.currencyId,
      nights: 0,
      nightlyBreakdown: [],
    };
  }

  /**
   * Nights, not calendar days: a stay that checks in and out on the same day
   * still costs one night, and a partial extra day rounds up.
   */
  /** Calendar overrides for every night of the stay, keyed by `YYYY-MM-DD`. */
  private async _getDailyOverrides(
    villaId: string,
    checkIn: Date,
    checkOut: Date,
    entityManager?: EntityManager,
  ): Promise<Map<string, VillaDailyRate>> {
    const repository = entityManager
      ? entityManager.getRepository(VillaDailyRate)
      : this.villaDailyRateRepository;

    // The check-out day is never charged, so the last night is the day before.
    const lastNight = new Date(checkOut.getTime() - MILLISECONDS_PER_DAY);

    if (lastNight < checkIn) {
      return new Map();
    }

    const rows = await repository.find({
      where: {
        villaId,
        date: Between(toDateKey(checkIn), toDateKey(lastNight)),
      },
    });

    return new Map(rows.map((row) => [toDateKey(row.date), row]));
  }

  private _countNights(checkIn: Date, checkOut: Date): number {
    const difference = checkOut.getTime() - checkIn.getTime();

    if (Number.isNaN(difference)) {
      throw new BadRequestException('check in and check out date are invalid');
    }

    if (difference <= 0) {
      throw new BadRequestException(
        'check out date must be after check in date',
      );
    }

    return Math.max(1, Math.ceil(difference / MILLISECONDS_PER_DAY));
  }

  /**
   * When several rules cover the same night the most recently started one wins,
   * mirroring how `VillaPriceService.recalculateVillaPrices` picks the rule that
   * owns the villa's current discounted prices.
   */
  private _resolveSeason(
    rules: VillaPriceRule[],
    night: Date,
  ): VillaPriceRuleSeason {
    const applicable = rules
      .filter(
        (rule) =>
          night >= new Date(rule.startDate) && night <= new Date(rule.endDate),
      )
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

    return applicable[0]?.season ?? VillaPriceRuleSeason.Regular_Season;
  }

  private _resolveNightlyRate(
    villa: Villa,
    season: VillaPriceRuleSeason,
  ): number {
    const seasonRates: Record<VillaPriceRuleSeason, [unknown, unknown]> = {
      [VillaPriceRuleSeason.Regular_Season]: [
        villa.dailyPriceAfterDiscount,
        villa.dailyPrice,
      ],
      [VillaPriceRuleSeason.Low_Season]: [
        villa.lowSeasonDailyPriceAfterDiscount,
        villa.lowSeasonDailyPrice,
      ],
      [VillaPriceRuleSeason.High_Season]: [
        villa.highSeasonDailyPriceAfterDiscount,
        villa.highSeasonDailyPrice,
      ],
      [VillaPriceRuleSeason.Peak_Season]: [
        villa.peakSeasonDailyPriceAfterDiscount,
        villa.peakSeasonDailyPrice,
      ],
    };

    const [discounted, base] = seasonRates[season];

    // A season without its own rate falls back to the regular daily rate rather
    // than pricing the night at zero.
    return (
      this._toNumber(discounted) ||
      this._toNumber(base) ||
      this._toNumber(villa.dailyPriceAfterDiscount) ||
      this._toNumber(villa.dailyPrice)
    );
  }

  /**
   * Postgres `numeric` columns arrive as strings through the driver; every
   * arithmetic path has to go through here or totals silently concatenate.
   */
  private _toNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  private _round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private _getVillaRepository(entityManager?: EntityManager): Repository<Villa> {
    return entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;
  }

  private _getActivityRepository(
    entityManager?: EntityManager,
  ): Repository<Activity> {
    return entityManager
      ? entityManager.getRepository(Activity)
      : this.activityRepository;
  }
}
