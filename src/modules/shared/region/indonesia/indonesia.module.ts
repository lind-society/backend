import { Module } from '@nestjs/common';
import { AxiosModule } from '../../axios/axios.module';
import { IndonesiaRegionService } from './indonesia.service';

@Module({
  providers: [IndonesiaRegionService],
  imports: [AxiosModule],
  exports: [IndonesiaRegionService],
})
export class IndonesiaRegionModule {}
