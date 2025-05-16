import { VillaPriceRuleSeason } from '@apps/main/database/entities';
import { VillaWithRelationsDto } from '../dto';

export interface IVillaCurrentDailyPriceDto {
  dailyPrice: number;
  dailyPriceAfterDiscount: number;
}

export function getVillaCurrentDailyPrice(
  season: VillaPriceRuleSeason,
  villa: VillaWithRelationsDto,
): IVillaCurrentDailyPriceDto {
  const seasonPriceMap: Record<
    VillaPriceRuleSeason,
    IVillaCurrentDailyPriceDto
  > = {
    [VillaPriceRuleSeason.Low_Season]: {
      dailyPrice:
        villa.lowSeasonDailyPrice != null ? villa.lowSeasonDailyPrice : 0,
      dailyPriceAfterDiscount:
        villa.lowSeasonDailyPriceAfterDiscount != null
          ? villa.lowSeasonDailyPriceAfterDiscount
          : 0,
    },
    [VillaPriceRuleSeason.Regular_Season]: {
      dailyPrice: villa.dailyPrice != null ? villa.dailyPrice : 0,
      dailyPriceAfterDiscount:
        villa.dailyPriceAfterDiscount != null
          ? villa.dailyPriceAfterDiscount
          : 0,
    },
    [VillaPriceRuleSeason.High_Season]: {
      dailyPrice:
        villa.highSeasonDailyPrice != null ? villa.highSeasonDailyPrice : 0,
      dailyPriceAfterDiscount:
        villa.highSeasonDailyPriceAfterDiscount != null
          ? villa.highSeasonDailyPriceAfterDiscount
          : 0,
    },
    [VillaPriceRuleSeason.Peak_Season]: {
      dailyPrice:
        villa.peakSeasonDailyPrice != null ? villa.peakSeasonDailyPrice : 0,
      dailyPriceAfterDiscount:
        villa.peakSeasonDailyPriceAfterDiscount != null
          ? villa.peakSeasonDailyPriceAfterDiscount
          : 0,
    },
  };

  return seasonPriceMap[season];
}
