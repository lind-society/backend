import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponseWithRequest } from './interfaces/axios-responses-interface';
import { CustomAxiosService } from './redirect/custom-axios.service';

@Injectable()
export class AxiosService {
  constructor(
    private httpService: HttpService,
    private customAxiosService: CustomAxiosService,
  ) {}
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, config));

    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.post<T>(url, data, config),
    );

    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.put<T>(url, data, config),
    );

    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.delete<T>(url, config),
    );

    return response.data;
  }

  async getRedirectUrl(shortUrl: string): Promise<string> {
    try {
      const axios = this.customAxiosService.getInstance();

      const response = await axios.get<AxiosResponseWithRequest>(shortUrl, {
        maxRedirects: 5,
        validateStatus: (status: number) =>
          status >= HttpStatus.OK && status < HttpStatus.BAD_REQUEST,
      });

      const redirectUrl = (response.request as any)?.res?.responseUrl;
      if (!redirectUrl) {
        throw new NotFoundException('redirected URL not found.');
      }

      return redirectUrl;
    } catch (error) {
      throw new NotFoundException('failed to get redirected URL.');
    }
  }
}
