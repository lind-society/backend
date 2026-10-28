import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import {
  ClearVillaDailyRatesDto,
  GetVillaCalendarDto,
  UpsertVillaDailyRatesDto,
} from './dto';
import { VillaDailyRateService } from './villa-daily-rate.service';

/**
 * The villa pricing calendar.
 *
 * Reads return every day in the window already resolved through
 * override -> season -> tier, so the dashboard renders what a guest would
 * actually be charged rather than re-deriving the rules in the browser.
 */
@UseGuards(JwtAuthGuard)
@Controller('villas/:villaId/calendar')
export class VillaDailyRateController {
  constructor(private readonly dailyRateService: VillaDailyRateService) {}

  @Get()
  async getCalendar(
    @Param('villaId', ParseUUIDPipe) villaId: string,
    @Query() query: GetVillaCalendarDto,
  ) {
    const days = await this.dailyRateService.getCalendar(
      villaId,
      query.from,
      query.to,
    );

    return { status: 'success', code: 200, data: { days } };
  }

  /** Applies one set of values to every selected date. */
  @Put()
  @HttpCode(200)
  async upsert(
    @Param('villaId', ParseUUIDPipe) villaId: string,
    @Body() payload: UpsertVillaDailyRatesDto,
  ) {
    const saved = await this.dailyRateService.upsert(villaId, payload);

    return {
      status: 'success',
      message: 'calendar updated',
      code: 200,
      data: { updated: saved.length },
    };
  }

  /** Removes the overrides so the dates fall back to their season. */
  @Delete()
  @HttpCode(200)
  async clear(
    @Param('villaId', ParseUUIDPipe) villaId: string,
    @Body() payload: ClearVillaDailyRatesDto,
  ) {
    const result = await this.dailyRateService.clear(villaId, payload);

    return {
      status: 'success',
      message: 'calendar overrides cleared',
      code: 200,
      data: result,
    };
  }
}
