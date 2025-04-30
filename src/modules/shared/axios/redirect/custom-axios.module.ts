// custom-axios.module.ts
import { Module } from '@nestjs/common';
import { CustomAxiosService } from './custom-axios.service';

@Module({
  providers: [CustomAxiosService],
  exports: [CustomAxiosService],
})
export class CustomAxiosModule {}
