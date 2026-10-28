import { VillaPriceRuleSeason } from '@apps/main/database/entities';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

/** `?from=2026-09-01&to=2026-09-30` — the window the calendar is showing. */
export class GetVillaCalendarDto {
  @IsISO8601({ strict: true })
  from!: string;

  @IsISO8601({ strict: true })
  to!: string;
}

/**
 * One resolved night, as the admin calendar renders it: the price actually in
 * force plus where it came from, so the UI can show an "overridden" badge
 * rather than making the admin guess.
 */
export class VillaCalendarDayDto {
  date!: string;
  price!: number;
  /** Which layer decided `price`. */
  source!: 'override' | 'season' | 'base';
  season!: VillaPriceRuleSeason;
  /** Name of the price rule that matched, when one did. */
  priceRuleName!: string | null;
  minStay!: number | null;
  isBlocked!: boolean;
  note!: string | null;
  /** True when the night already belongs to a live booking. */
  isBooked!: boolean;
}

/** Values applied to every date in the selection. */
export class VillaDailyRateValuesDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  minStay?: number | null;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

/** Bulk upsert: "apply these values to these dates". */
export class UpsertVillaDailyRatesDto extends VillaDailyRateValuesDto {
  @IsArray()
  @IsISO8601({ strict: true }, { each: true })
  dates!: string[];
}

/** Bulk clear: drop the overrides so the dates fall back to their season. */
export class ClearVillaDailyRatesDto {
  @IsArray()
  @IsISO8601({ strict: true }, { each: true })
  dates!: string[];
}

export class VillaCalendarResponseDto {
  @ValidateNested({ each: true })
  @Type(() => VillaCalendarDayDto)
  days!: VillaCalendarDayDto[];
}
