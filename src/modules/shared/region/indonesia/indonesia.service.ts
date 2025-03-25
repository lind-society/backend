import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { startCase, toLower } from 'lodash';
import { AxiosService } from '../../axios/axios.service';
import {
  IndonesiaPostalCodeDto,
  IndonesiaPostalCodePayloadDto,
  IndonesiaRegionDto,
  IndonesiaRegionPayloadDto,
} from './dto';

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

  async getProvince(): Promise<IndonesiaRegionPayloadDto[]> {
    try {
      const data = await this.axiosService.get<IndonesiaRegionDto[]>(
        `${this.indonesiaRegionBaseUrl}/provinsi.json`,
      );

      return this._mapRegionToPayload(data);
    } catch (error) {
      throw error;
    }
  }

  async getCity(provinceId: string): Promise<IndonesiaRegionPayloadDto[]> {
    if (isNaN(Number(provinceId))) {
      throw new BadRequestException('province id must be a valid number');
    }

    try {
      const data = await this.axiosService.get<IndonesiaRegionDto[]>(
        `${this.indonesiaRegionBaseUrl}/kota/${provinceId}.json`,
      );

      return this._mapRegionToPayload(data);
    } catch (error) {
      throw error;
    }
  }

  async getDistrict(cityId: string): Promise<IndonesiaRegionPayloadDto[]> {
    if (isNaN(Number(cityId))) {
      throw new BadRequestException('city id must be a valid number');
    }

    try {
      const data = await this.axiosService.get<IndonesiaRegionDto[]>(
        `${this.indonesiaRegionBaseUrl}/kecamatan/${cityId}.json`,
      );

      return this._mapRegionToPayload(data);
    } catch (error) {
      throw error;
    }
  }

  async getSubDistrict(
    districtId: string,
  ): Promise<IndonesiaRegionPayloadDto[]> {
    if (isNaN(Number(districtId))) {
      throw new BadRequestException('district id must be a valid number');
    }

    try {
      const data = await this.axiosService.get<IndonesiaRegionDto[]>(
        `${this.indonesiaRegionBaseUrl}/kelurahan/${districtId}.json`,
      );

      return this._mapRegionToPayload(data);
    } catch (error) {
      throw error;
    }
  }

  async getPostalCode(
    subDistrictName: string,
  ): Promise<IndonesiaPostalCodePayloadDto[]> {
    try {
      const data = await this.axiosService.get<IndonesiaPostalCodeDto>(
        `${this.indonesiaPostalCodeBaseUrl}?q=${subDistrictName.toLowerCase()}`,
      );

      return this._mapPostalCodeToPayload(data);
    } catch (error) {
      throw error;
    }
  }

  private _mapRegionToPayload<T extends IndonesiaRegionDto>(
    data: T[],
  ): IndonesiaRegionPayloadDto[] {
    return data.map((item) => ({
      id: item.id,
      name: startCase(toLower(item.nama)),
    })) as IndonesiaRegionPayloadDto[];
  }

  private _mapPostalCodeToPayload<T extends IndonesiaPostalCodeDto>(
    data: T,
  ): IndonesiaPostalCodePayloadDto[] {
    return data.data.map((item) => ({
      code: item.code,
      village: item.village,
      district: item.district,
      regency: item.regency,
      province: item.province,
      timezone: item.timezone,
    })) as IndonesiaPostalCodePayloadDto[];
  }
}
