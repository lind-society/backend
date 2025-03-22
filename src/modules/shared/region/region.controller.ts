import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('province')
  async getProvince(
    @Query('country') country: string,
    @Query('countryId') countryId: string,
  ) {
    return await this.regionService.getProvince(countryId, country);
  }

  @Get('city')
  async getCity(
    @Query('country') country: string,
    @Query('province') provinceId: string,
  ) {
    return await this.regionService.getCity(provinceId, country);
  }

  @Get('district')
  async getDistrict(
    @Query('country') country: string,
    @Query('city') cityId: string,
  ) {
    return await this.regionService.getDistrict(cityId, country);
  }

  @Get('sub-district')
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
