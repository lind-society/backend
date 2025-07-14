import { Module } from '@nestjs/common';
import { GlobalRegionService } from './global-region.service';

@Module({
  providers: [GlobalRegionService],
  exports: [GlobalRegionService],
})
export class GlobalRegionModule {}
