import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AxiosService {
  constructor(private httpService: HttpService) {}
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, config));

    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.post<T>(url, data, config),
    );

    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.put<T>(url, data, config),
    );

    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.delete<T>(url, config),
    );
    
    return response.data;
  }
}
