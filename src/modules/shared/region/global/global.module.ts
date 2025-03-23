import { Module } from '@nestjs/common';
import { AxiosModule } from '../../axios/axios.module';
import { GlobalRegionService } from './global.service';

@Module({
  providers: [GlobalRegionService],
  imports: [AxiosModule],
  exports: [GlobalRegionService],
})
export class GlobalRegionModule {}
