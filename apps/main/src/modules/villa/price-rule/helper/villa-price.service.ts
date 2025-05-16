import {
  Villa,
  VillaPriceRule,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { VillaDto } from '../../dto';

@Injectable()
export class VillaPriceService {
  constructor(
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
    @InjectRepository(VillaPriceRule)
    private villaPriceRuleRepository: Repository<VillaPriceRule>,
  ) {}

  /**
   * Update discounted prices for all villas affected by a price rule
   * This should be called upon a villa price rules change (update villa price rule)
   */

  async updateVillaPrices(
    priceRuleId: string,
    entityManager: EntityManager,
  ): Promise<void> {
    const villaRepository = entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;

    const villaPriceRuleRepository = entityManager
      ? entityManager.getRepository(VillaPriceRule)
      : this.villaPriceRuleRepository;

    const villas = await villaRepository
      .createQueryBuilder('villa')
      .innerJoin('villa.villaPriceRules', 'vpr')
      .innerJoin('vpr.priceRule', 'vpr')
      .where('pr.id = :priceRuleId', { priceRuleId })
      .getMany();

    if (villas.length === 0) {
      return;
    }

    const priceRule = await villaPriceRuleRepository.findOneBy({
      id: priceRuleId,
    });

    if (!priceRule) {
      return;
    }

    const { discount, isDiscount, isActive, season, startDate, endDate } =
      priceRule;

    const currentDate = new Date();
    const isRuleActive =
      isActive &&
      currentDate >= new Date(startDate) &&
      currentDate <= new Date(endDate);

    for (const villa of villas) {
      if (isRuleActive) {
        this._setDiscountPrices(villa, season, isDiscount, discount);
      }

      await villaRepository.save(villa);
    }
  }

  /**
   * Recalculate all discounted prices for a specific villa
   * This should be called when a villa's base prices change (update villa action)
   */

  async recalculateVillaPrices(
    villaId: string,
    entityManager: EntityManager,
  ): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;

    const villa = await repository.findOne({
      where: {
        id: villaId,
      },
      relations: {
        villaPriceRules: { priceRule: true },
      },
    });

    if (!villa) {
      return;
    }

    console.log(villa);

    const currentDate = new Date();

    villa.dailyPriceAfterDiscount = null;
    villa.lowSeasonDailyPriceAfterDiscount = null;
    villa.highSeasonDailyPriceAfterDiscount = null;
    villa.peakSeasonDailyPriceAfterDiscount = null;

    const activePriceRules = villa.villaPriceRules
      .filter((vpr) => {
        const rule = vpr.priceRule;

        return (
          rule.isActive &&
          currentDate >= new Date(rule.startDate) &&
          currentDate <= new Date(rule.endDate)
        );
      })
      .map((vpr) => vpr.priceRule)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

    if (activePriceRules.length > 0) {
      const currentActiveRule = activePriceRules[0];

      const { discount, isDiscount, season } = currentActiveRule;

      this._setDiscountPrices(villa, season, isDiscount, discount);

      await repository.save(villa);
    } else {
      villa.dailyPriceAfterDiscount = villa.dailyPrice;
      villa.peakSeasonDailyPriceAfterDiscount = villa.peakSeasonDailyPrice;
      villa.highSeasonDailyPriceAfterDiscount = villa.highSeasonDailyPrice;
      villa.lowSeasonDailyPriceAfterDiscount = villa.lowSeasonDailyPrice;

      await repository.save(villa);
    }
  }

  private _setDiscountPrices(
    villa: VillaDto,
    season: VillaPriceRuleSeason,
    isDiscount: boolean,
    discount: number,
  ) {
    switch (season) {
      case VillaPriceRuleSeason.Peak_Season:
        if (villa.peakSeasonDailyPrice) {
          villa.peakSeasonDailyPriceAfterDiscount = isDiscount
            ? Math.max(0, villa.peakSeasonDailyPrice) - discount
            : villa.peakSeasonDailyPrice;
        }

        break;

      case VillaPriceRuleSeason.High_Season:
        if (villa.highSeasonDailyPrice) {
          villa.highSeasonDailyPriceAfterDiscount = isDiscount
            ? Math.max(0, villa.highSeasonDailyPrice) - discount
            : villa.highSeasonDailyPrice;
        }

        break;

      case VillaPriceRuleSeason.Low_Season:
        if (villa.lowSeasonDailyPrice) {
          villa.lowSeasonDailyPriceAfterDiscount = isDiscount
            ? Math.max(0, villa.lowSeasonDailyPrice) - discount
            : villa.lowSeasonDailyPrice;
        }

        break;

      default:
        if (villa.dailyPrice) {
          villa.dailyPriceAfterDiscount = isDiscount
            ? Math.max(0, villa.dailyPrice) - discount
            : villa.dailyPrice;
        }

        break;
    }
  }
}
