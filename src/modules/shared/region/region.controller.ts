import { Controller, Get, Query } from '@nestjs/common';
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
    @Query('country') country: string,
    @Query('countryId') countryId: string,
  ) {
    return await this.regionService.getProvince(countryId, country);
  }

  @Get('cities')
  async getCity(
    @Query('country') country: string,
    @Query('province') provinceId: string,
  ) {
    return await this.regionService.getCity(provinceId, country);
  }

  @Get('districts')
  async getDistrict(
    @Query('country') country: string,
    @Query('city') cityId: string,
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
    @Query('country') country: string,
    @Query('sub-district') subDistrictId: string,
  ) {
    return await this.regionService.getPostalCode(subDistrictId, country);
  }
}
