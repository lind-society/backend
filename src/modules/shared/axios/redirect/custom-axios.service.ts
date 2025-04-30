// custom-axios.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class CustomAxiosService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
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
    });
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
