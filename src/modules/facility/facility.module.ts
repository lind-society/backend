import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';
import { FacilityCategoryModule } from './facility-category/facility-category.module';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService],
  imports: [FacilityCategoryModule],
})
export class FacilityModule {}
