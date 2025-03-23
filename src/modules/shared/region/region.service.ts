import { BadRequestException, Injectable } from '@nestjs/common';
import { GetGlobalPostalCodePayload } from './global/dto';
import { GlobalRegionService } from './global/global.service';
import { IndonesiaRegionService } from './indonesia/indonesia.service';

@Injectable()
export class RegionService {
  constructor(
    private globalRegionService: GlobalRegionService,
    private indonesiaRegionService: IndonesiaRegionService,
  ) {}

  async getContinent() {
    return await this.globalRegionService.getContinent();
  }

  async getCountry(continentCode: string) {
    return await this.globalRegionService.getCountry(continentCode);
  }

  async getProvince(countryId: string = '', country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getProvince();
    } else {
      return await this.globalRegionService.getChildren(countryId);
    }
  }

  async getCity(provinceId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getCity(provinceId);
    } else {
      return await this.globalRegionService.getChildren(provinceId);
    }
  }

  async getDistrict(cityId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getDistrict(cityId);
    } else {
      return await this.globalRegionService.getChildren(cityId);
    }
  }

  async getSubDistrict(districtId: string, country?: string) {
    if (country === 'indonesia') {
      return await this.indonesiaRegionService.getSubDistrict(districtId);
    } else {
      return await this.globalRegionService.getChildren(districtId);
    }
  }

  async getPostalCode(payload: GetGlobalPostalCodePayload) {
    if (payload.country === 'indonesia') {
      if (!payload.subDistrict) {
        throw new BadRequestException('please input subdistrict id');
      }

      return await this.indonesiaRegionService.getPostalCode(
        payload.subDistrictId,
      );
    } else {
      if (!payload.subDistrict || !payload.district || !payload.city) {
        throw new BadRequestException('please input region name');
      }
      return await this.globalRegionService.getPostalCode(
        payload.provinceCode,
        payload.secondaryProvinceCode,
        payload.subDistrict,
        payload.district,
        payload.city,
      );
    }
  }
}
