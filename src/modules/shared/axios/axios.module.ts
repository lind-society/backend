import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import { AxiosService } from './axios.service';

@Module({
  providers: [AxiosService],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      httpAgent: new http.Agent({
        keepAlive: true,
        keepAliveMsecs: 60000,
        maxSockets: 30,
      }),
      httpsAgent: new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 60000,
        maxSockets: 30,
      }),
    }),
  ],
  exports: [AxiosService],
})
export class AxiosModule {}
