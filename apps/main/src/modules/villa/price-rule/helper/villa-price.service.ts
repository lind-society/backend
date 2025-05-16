import {
  DiscountType,
  Villa,
  VillaPriceRule,
} from '@apps/main/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
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
      .innerJoin('vpr.priceRule', 'pr')
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

    const { discount, discountType, isDiscount, isActive, startDate, endDate } =
      priceRule;

    const currentDate = new Date();
    const isRuleActive =
      isActive &&
      currentDate >= new Date(startDate) &&
      currentDate <= new Date(endDate);

    for (const villa of villas) {
      if (isRuleActive) {
        this._setDiscountPrices(villa, isDiscount, discountType, discount);
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
    const villaRepository = entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;

    const villaPriceRulerepository = entityManager
      ? entityManager.getRepository(VillaPriceRule)
      : this.villaRepository;

    const villa = await villaRepository.findOne({
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

    const villaPriceRuleIds = villa.villaPriceRules.map(
      (villaPriceRule) => villaPriceRule.priceRuleId,
    );

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

      const priceRuleIdsToDeactivate = villaPriceRuleIds.filter(
        (id) => id !== currentActiveRule.id,
      );

      if (priceRuleIdsToDeactivate.length > 0) {
        await villaPriceRulerepository.update(
          { id: In(priceRuleIdsToDeactivate) },
          { isActive: false },
        );
      }

      const { discount, discountType, isDiscount } = currentActiveRule;

      this._setDiscountPrices(villa, isDiscount, discountType, discount);

      await villaRepository.save(villa);
    } else {
      villa.dailyPriceAfterDiscount = villa.dailyPrice;
      villa.peakSeasonDailyPriceAfterDiscount = villa.peakSeasonDailyPrice;
      villa.highSeasonDailyPriceAfterDiscount = villa.highSeasonDailyPrice;
      villa.lowSeasonDailyPriceAfterDiscount = villa.lowSeasonDailyPrice;

      await villaRepository.save(villa);
    }
  }

  private _setDiscountPrices(
    villa: VillaDto,
    isDiscount: boolean,
    discountType: DiscountType,
    discount: number,
  ) {
    const currentDiscountType = discountType ?? DiscountType.Percentage;
    const priceRuleDiscount = isDiscount ? (discount ?? 0) : 0;

    const dailyPrice = villa.dailyPrice != null ? villa.dailyPrice : 0;
    const lowSeasonDailyPrice =
      villa.lowSeasonDailyPrice != null ? villa.lowSeasonDailyPrice : 0;
    const highSeasonDailyPrice =
      villa.highSeasonDailyPrice != null ? villa.highSeasonDailyPrice : 0;
    const peakSeasonDailyPrice =
      villa.peakSeasonDailyPrice != null ? villa.peakSeasonDailyPrice : 0;

    villa.dailyPriceAfterDiscount = Math.max(
      0,
      currentDiscountType === DiscountType.Fixed
        ? dailyPrice - priceRuleDiscount
        : dailyPrice * (1 - priceRuleDiscount / 100),
    );

    villa.lowSeasonDailyPriceAfterDiscount = Math.max(
      0,
      currentDiscountType === DiscountType.Fixed
        ? lowSeasonDailyPrice - priceRuleDiscount
        : lowSeasonDailyPrice * (1 - priceRuleDiscount / 100),
    );

    villa.highSeasonDailyPriceAfterDiscount = Math.max(
      0,
      currentDiscountType === DiscountType.Fixed
        ? highSeasonDailyPrice + priceRuleDiscount
        : highSeasonDailyPrice * (1 + priceRuleDiscount / 100),
    );

    villa.peakSeasonDailyPriceAfterDiscount = Math.max(
      0,
      currentDiscountType === DiscountType.Fixed
        ? peakSeasonDailyPrice + priceRuleDiscount
        : peakSeasonDailyPrice * (1 + priceRuleDiscount / 100),
    );
  }
}
