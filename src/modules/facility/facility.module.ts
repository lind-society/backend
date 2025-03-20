import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService],
  imports: [TypeOrmModule.forFeature([Facility]), CurrencyModule],
  exports: [FacilityService],
})
export class FacilityModule {}
