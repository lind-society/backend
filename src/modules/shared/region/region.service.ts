import { Injectable } from '@nestjs/common';
import { IndonesiaRegionService } from './indonesia/indonesia.service';

@Injectable()
export class RegionService {
  constructor(private indonesiaRegionService: IndonesiaRegionService) {}
  async getProvince(countryId: string = '', country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getProvince();
    } else {
      return 'not implemented';
    }
  }

  async getCity(provinceId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getCity(provinceId);
    } else {
      return 'not implemented';
    }
  }

  async getDistrict(cityId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getDistrict(cityId);
    } else {
      return 'not implemented';
    }
  }

  async getSubDistrict(districtId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getSubDistrict(districtId);
    } else {
      return 'not implemented';
    }
  }

  async getPostalCode(subDistrictId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getPostalCode(subDistrictId);
    } else {
      return 'not implemented';
    }
  }
}
