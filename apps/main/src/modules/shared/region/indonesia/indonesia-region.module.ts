import { Module } from '@nestjs/common';
import { IndonesiaRegionService } from './indonesia-region.service';

@Module({
  providers: [IndonesiaRegionService],
  exports: [IndonesiaRegionService],
})
export class IndonesiaRegionModule {}
