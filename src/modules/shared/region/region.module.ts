import { Module } from '@nestjs/common';
import { GlobalRegionModule } from './global/global.module';
import { IndonesiaRegionModule } from './indonesia/indonesia.module';
import { PhoneCodeModule } from './phone-code/phone-code.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
  imports: [GlobalRegionModule, IndonesiaRegionModule, PhoneCodeModule],
})
export class RegionModule {}
