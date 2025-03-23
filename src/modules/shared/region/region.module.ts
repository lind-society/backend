import { Module } from '@nestjs/common';
import { GlobalRegionModule } from './global/global.module';
import { IndonesiaRegionModule } from './indonesia/indonesia.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
  imports: [GlobalRegionModule, IndonesiaRegionModule],
})
export class RegionModule {}
