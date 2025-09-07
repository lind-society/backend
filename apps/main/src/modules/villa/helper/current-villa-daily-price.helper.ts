import {
  DiscountType,
  VillaPriceRuleSeason,
} from '@apps/main/database/entities';
import { VillaPaginationDto, VillaWithRelationsDto } from '../dto';
import {
  RelatedVillaPriceRuleDto,
  VillaPriceRuleWithRelationsDto,
} from '../price-rule/dto';

export interface IVillaCurrentDailyPriceDto {
  dailyPrice: number;
  dailyPriceAfterDiscount: number;
}

function calculateDiscountedPrice(
  discountType: DiscountType,
  price: number,
  discountAmount: number,
) {
  switch (discountType) {
    case DiscountType.Fixed:
      return Math.max(price - discountAmount, 0);

    case DiscountType.Percentage:
      const discountPrice = price * (discountAmount / 100);
      return Math.max(price - discountPrice, 0);

    default:
      return Math.max(price, 0);
  }
}

export function getVillaCurrentDailyPrice(
  priceRule: VillaPriceRuleWithRelationsDto | RelatedVillaPriceRuleDto,
  villa: VillaWithRelationsDto | VillaPaginationDto,
): IVillaCurrentDailyPriceDto {
  const { season, discount, discountType } = priceRule;

  const seasonPriceMap: Record<
    VillaPriceRuleSeason,
    IVillaCurrentDailyPriceDto
  > = {
    [VillaPriceRuleSeason.Low_Season]: {
      dailyPrice: villa.lowSeasonDailyPrice ?? 0,
      dailyPriceAfterDiscount:
        villa.lowSeasonDailyPriceAfterDiscount != null
          ? calculateDiscountedPrice(
              discountType,
              villa.lowSeasonDailyPrice,
              discount,
            )
          : 0,
    },
    [VillaPriceRuleSeason.Regular_Season]: {
      dailyPrice: villa.dailyPrice ?? 0,
      dailyPriceAfterDiscount:
        villa.dailyPriceAfterDiscount != null
          ? calculateDiscountedPrice(discountType, villa.dailyPrice, discount)
          : 0,
    },
    [VillaPriceRuleSeason.High_Season]: {
      dailyPrice: villa.highSeasonDailyPrice ?? 0,
      dailyPriceAfterDiscount:
        villa.highSeasonDailyPriceAfterDiscount != null
          ? calculateDiscountedPrice(
              discountType,
              villa.highSeasonDailyPrice,
              discount,
            )
          : 0,
    },
    [VillaPriceRuleSeason.Peak_Season]: {
      dailyPrice: villa.peakSeasonDailyPrice ?? 0,
      dailyPriceAfterDiscount:
        villa.peakSeasonDailyPriceAfterDiscount != null
          ? calculateDiscountedPrice(
              discountType,
              villa.peakSeasonDailyPrice,
              discount,
            )
          : 0,
    },
  };

  return seasonPriceMap[season];
}
