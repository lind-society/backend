import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  providers: [AxiosService],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [AxiosService],
})
export class AxiosModule {}
