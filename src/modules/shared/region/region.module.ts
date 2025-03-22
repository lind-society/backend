import { Module } from '@nestjs/common';
import { AxiosModule } from '../axios/axios.module';
import { IndonesiaRegionModule } from './indonesia/indonesia.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
  imports: [AxiosModule, IndonesiaRegionModule],
})
export class RegionModule {}
