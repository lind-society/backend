import { Module } from '@nestjs/common';
import { AdditionalModule } from './additional/additional.module';
import { FacilityModule } from './facility/facility.module';
import { FeatureModule } from './feature/feature.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [AdditionalModule, FacilityModule, FeatureModule],
})
export class PropertyModule {}
