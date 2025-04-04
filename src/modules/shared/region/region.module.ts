import { Module } from '@nestjs/common';
import { GlobalRegionModule } from './global/global-region.module';
import { IndonesiaRegionModule } from './indonesia/indonesia-region.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
  imports: [GlobalRegionModule, IndonesiaRegionModule],
})
export class RegionModule {}
