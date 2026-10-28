import { Booking, Villa, VillaDailyRate } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaDailyRateController } from './villa-daily-rate.controller';
import { VillaDailyRateService } from './villa-daily-rate.service';

@Module({
  controllers: [VillaDailyRateController],
  providers: [VillaDailyRateService],
  imports: [TypeOrmModule.forFeature([VillaDailyRate, Villa, Booking])],
  exports: [VillaDailyRateService],
})
export class VillaDailyRateModule {}
