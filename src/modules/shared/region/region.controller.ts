import { Controller, Get, Query } from '@nestjs/common';
import { GetGlobalPostalCodePayload } from './global/dto';
import { RegionService } from './region.service';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('continents')
  async getContinent() {
    return await this.regionService.getContinent();
  }

  @Get('countries')
  async getCountry(@Query('continent') continentCode: string) {
    return await this.regionService.getCountry(continentCode);
  }

  @Get('provinces')
  async getProvince(
    @Query('countryId') countryId: string,
    @Query('country') country: string,
  ) {
    return await this.regionService.getProvince(countryId, country);
  }

  @Get('cities')
  async getCity(
    @Query('province') provinceId: string,
    @Query('country') country: string,
  ) {
    return await this.regionService.getCity(provinceId, country);
  }

  @Get('districts')
  async getDistrict(
    @Query('city') cityId: string,
    @Query('country') country: string,
  ) {
    return await this.regionService.getDistrict(cityId, country);
  }

  @Get('sub-districts')
  async getSubDistrict(
    @Query('country') country: string,
    @Query('district') districtId: string,
  ) {
    return await this.regionService.getSubDistrict(districtId, country);
  }

  @Get('postal-code')
  async getPostalCode(
    @Query('subDistrict') subDistrict: string,
    @Query('district') district: string,
    @Query('city') city: string,
    @Query('provinceCode') provinceCode: string,
    @Query('secondaryProvinceCode') secondaryProvinceCode: string,
    @Query('subDistrictId') subDistrictId: string,
    @Query('country') country: string,
  ) {
    const payload: GetGlobalPostalCodePayload = {
      subDistrict,
      district,
      city,
      provinceCode,
      secondaryProvinceCode,
      subDistrictId,
      country,
    };

    return await this.regionService.getPostalCode(payload);
  }
}
