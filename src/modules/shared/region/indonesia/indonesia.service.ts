import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from '../../axios/axios.service';
import { IndonesiaRegionDto } from './dto';

@Injectable()
export class IndonesiaRegionService {
  private indonesiaRegionBaseUrl: string;
  private indonesiaPostalCodeBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private axiosService: AxiosService,
  ) {
    this.indonesiaRegionBaseUrl =
      this.configService.get<string>('region.indonesia');
    this.indonesiaPostalCodeBaseUrl = this.configService.get<string>(
      'postalCode.indonesia',
    );
  }

  async getProvince(): Promise<IndonesiaRegionDto> {
    try {
      const data = await this.axiosService.get(
        `${this.indonesiaRegionBaseUrl}/provinsi.json`,
      );

      return data as IndonesiaRegionDto;
    } catch (error) {
      throw error;
    }
  }

  async getCity(provinceId: string): Promise<IndonesiaRegionDto> {
    try {
      const data = await this.axiosService.get(
        `${this.indonesiaRegionBaseUrl}/kota/${provinceId}.json`,
      );

      return data as IndonesiaRegionDto;
    } catch (error) {
      throw error;
    }
  }

  async getDistrict(cityId: string): Promise<IndonesiaRegionDto> {
    try {
      const data = await this.axiosService.get(
        `${this.indonesiaRegionBaseUrl}/kecamatan/${cityId}.json`,
      );

      return data as IndonesiaRegionDto;
    } catch (error) {
      throw error;
    }
  }

  async getSubDistrict(districtId: string): Promise<IndonesiaRegionDto> {
    try {
      const data = await this.axiosService.get(
        `${this.indonesiaRegionBaseUrl}/kelurahan/${districtId}.json`,
      );

      return data as IndonesiaRegionDto;
    } catch (error) {
      throw error;
    }
  }

  async getPostalCode(subDistrictName: string): Promise<IndonesiaRegionDto> {
    try {
      const data = await this.axiosService.get(
        `${this.indonesiaPostalCodeBaseUrl}?q=${subDistrictName.toLowerCase()}`,
      );

      return data as IndonesiaRegionDto;
    } catch (error) {
      throw error;
    }
  }
}
