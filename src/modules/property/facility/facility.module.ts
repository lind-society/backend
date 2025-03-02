import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import {
  Facility,
  FacilityCategory,
  FacilityCategoryPivot,
} from 'src/database/entities';
import { FacilityCategoryModule } from './facility-category/facility-category.module';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService],
  imports: [
    TypeOrmModule.forFeature([
      Facility,
      FacilityCategory,
      FacilityCategoryPivot,
    ]),
    FacilityCategoryModule,
  ],
})
export class FacilityModule {}
