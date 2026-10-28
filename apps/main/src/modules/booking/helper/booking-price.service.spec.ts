import { VillaPriceRuleSeason } from '@apps/main/database/entities';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingPriceService } from './booking-price.service';

/**
 * The repositories are stubbed: what matters here is the arithmetic and the
 * season selection, not TypeORM.
 */
function buildService(villa: unknown, activity?: unknown) {
  const villaRepository = { findOne: jest.fn().mockResolvedValue(villa) };
  const activityRepository = {
    findOne: jest.fn().mockResolvedValue(activity ?? null),
  };

  return new BookingPriceService(
    villaRepository as never,
    activityRepository as never,
  );
}

function priceRule(
  season: VillaPriceRuleSeason,
  startDate: string,
  endDate: string,
  isActive = true,
) {
  return {
    priceRule: {
      season,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive,
    },
  };
}

describe('BookingPriceService', () => {
  const baseVilla = {
    id: 'villa-1',
    currencyId: 'currency-1',
    // Postgres returns numeric columns as strings — the service has to cope.
    dailyPrice: '1000000.00',
    dailyPriceAfterDiscount: '900000.00',
    lowSeasonDailyPrice: '800000.00',
    lowSeasonDailyPriceAfterDiscount: null,
    highSeasonDailyPrice: '1500000.00',
    highSeasonDailyPriceAfterDiscount: '1400000.00',
    peakSeasonDailyPrice: null,
    peakSeasonDailyPriceAfterDiscount: null,
    villaPriceRules: [],
  };

  describe('villa pricing', () => {
    it('charges one night per night stayed at the discounted regular rate', async () => {
      const service = buildService(baseVilla);

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T14:00:00.000Z',
        '2026-01-23T11:00:00.000Z',
      );

      expect(result.nights).toBe(3);
      expect(result.totalAmount).toBe(2700000);
      expect(result.currencyId).toBe('currency-1');
    });

    it('prices each night against the season that covers it', async () => {
      const service = buildService({
        ...baseVilla,
        villaPriceRules: [
          priceRule(
            VillaPriceRuleSeason.High_Season,
            '2026-01-21T00:00:00.000Z',
            '2026-01-22T23:59:59.000Z',
          ),
        ],
      });

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T00:00:00.000Z',
        '2026-01-23T00:00:00.000Z',
      );

      // 20th regular (900k) + 21st and 22nd high season (1.4m each)
      expect(result.totalAmount).toBe(3700000);
      expect(result.nightlyBreakdown.map((night) => night.season)).toEqual([
        VillaPriceRuleSeason.Regular_Season,
        VillaPriceRuleSeason.High_Season,
        VillaPriceRuleSeason.High_Season,
      ]);
    });

    it('ignores inactive price rules', async () => {
      const service = buildService({
        ...baseVilla,
        villaPriceRules: [
          priceRule(
            VillaPriceRuleSeason.High_Season,
            '2026-01-20T00:00:00.000Z',
            '2026-01-25T00:00:00.000Z',
            false,
          ),
        ],
      });

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T00:00:00.000Z',
        '2026-01-21T00:00:00.000Z',
      );

      expect(result.totalAmount).toBe(900000);
    });

    it('falls back to the undiscounted rate when a season has no discounted price', async () => {
      const service = buildService({
        ...baseVilla,
        villaPriceRules: [
          priceRule(
            VillaPriceRuleSeason.Low_Season,
            '2026-01-20T00:00:00.000Z',
            '2026-01-25T00:00:00.000Z',
          ),
        ],
      });

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T00:00:00.000Z',
        '2026-01-21T00:00:00.000Z',
      );

      expect(result.totalAmount).toBe(800000);
    });

    it('falls back to the regular rate for a season with no price at all', async () => {
      const service = buildService({
        ...baseVilla,
        villaPriceRules: [
          priceRule(
            VillaPriceRuleSeason.Peak_Season,
            '2026-01-20T00:00:00.000Z',
            '2026-01-25T00:00:00.000Z',
          ),
        ],
      });

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T00:00:00.000Z',
        '2026-01-21T00:00:00.000Z',
      );

      expect(result.totalAmount).toBe(900000);
    });

    it('counts a partial extra day as a full night', async () => {
      const service = buildService(baseVilla);

      const result = await service.calculateVillaBooking(
        'villa-1',
        '2026-01-20T14:00:00.000Z',
        '2026-01-21T11:00:00.000Z',
      );

      expect(result.nights).toBe(1);
    });

    it('rejects a check-out that is not after check-in', async () => {
      const service = buildService(baseVilla);

      await expect(
        service.calculateVillaBooking(
          'villa-1',
          '2026-01-20T00:00:00.000Z',
          '2026-01-20T00:00:00.000Z',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses to price a villa with no rate configured', async () => {
      const service = buildService({
        ...baseVilla,
        dailyPrice: null,
        dailyPriceAfterDiscount: null,
      });

      await expect(
        service.calculateVillaBooking(
          'villa-1',
          '2026-01-20T00:00:00.000Z',
          '2026-01-21T00:00:00.000Z',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses to price a villa with no currency', async () => {
      const service = buildService({ ...baseVilla, currencyId: null });

      await expect(
        service.calculateVillaBooking(
          'villa-1',
          '2026-01-20T00:00:00.000Z',
          '2026-01-21T00:00:00.000Z',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('reports a missing villa as not found', async () => {
      const service = buildService(null);

      await expect(
        service.calculateVillaBooking(
          'missing',
          '2026-01-20T00:00:00.000Z',
          '2026-01-21T00:00:00.000Z',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('activity pricing', () => {
    it('prefers the discounted price', async () => {
      const service = buildService(null, {
        id: 'activity-1',
        price: '500000.00',
        priceAfterDiscount: '400000.00',
        currencyId: 'currency-1',
      });

      const result = await service.calculateActivityBooking('activity-1');

      expect(result.totalAmount).toBe(400000);
    });

    it('falls back to the list price', async () => {
      const service = buildService(null, {
        id: 'activity-1',
        price: '500000.00',
        priceAfterDiscount: null,
        currencyId: 'currency-1',
      });

      const result = await service.calculateActivityBooking('activity-1');

      expect(result.totalAmount).toBe(500000);
    });
  });
});
