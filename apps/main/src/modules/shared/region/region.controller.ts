import { SkipHal } from '@apps/main/common/decorators';
import { Controller, Get, Query } from '@nestjs/common';
import { GetGlobalPostalCodePayload } from './global/dto';
import { RegionService } from './region.service';

@SkipHal()
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('phone-codes')
  async getPhoneCode() {
    return await this.regionService.getPhoneCode();
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
    @Query('provinceId') provinceId: string,
  ) {
    return await this.regionService.getCity(provinceId, country);
  }

  @Get('districts')
  async getDistrict(
    @Query('country') country: string,
    @Query('cityId') cityId: string,
  ) {
    return await this.regionService.getDistrict(cityId, country);
  }

  @Get('sub-districts')
  async getSubDistrict(
    @Query('country') country: string,
    @Query('districtId') districtId: string,
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
    @Query('country') country: string,
  ) {
    const payload: GetGlobalPostalCodePayload = {
      subDistrict,
      district,
      city,
      provinceCode,
      secondaryProvinceCode,
      country,
    };

    return await this.regionService.getPostalCode(payload);
  }

  @Get('coordinates')
  async getCoordinates(@Query('shortUrl') shortUrl: string) {
    return await this.regionService.getCoordinates(shortUrl);
  }
}
