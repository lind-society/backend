import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { continents } from 'src/common/constants';
import { AxiosService } from '../../axios/axios.service';
import {
  GlobalCountryGeoNamesDetailDto,
  GlobalCountryGeoNamesDto,
  GlobalRegionDto,
  GlobalRegionGeoNamesDetailDto,
  GlobalRegionPayloadDto,
} from './dto';

@Injectable()
export class GlobalRegionService {
  private geonamesApiUsername: string;
  private globalRegionBaseUrl: string;
  private globalPostalCodeBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private axiosService: AxiosService,
  ) {
    this.geonamesApiUsername = this.configService.get<string>(
      'region.geonames.username',
    );
    this.globalRegionBaseUrl = this.configService.get<string>('region.global');
    this.globalPostalCodeBaseUrl =
      this.configService.get<string>('postalCode.global');
  }

  async getContinent() {
    return continents;
  }

  async getCountry(continendCode: string) {
    try {
      const data = await this.axiosService.get<GlobalCountryGeoNamesDto>(
        `${this.globalRegionBaseUrl}/countryInfoJSON?username=${this.geonamesApiUsername}`,
      );

      const filteredCountries = continendCode
        ? data.geonames.filter((country) => country.continent === continendCode)
        : data.geonames;

      return this._mapCountryToPayload(filteredCountries);
    } catch (error) {
      throw error;
    }
  }

  // method for getting data that are related of a geoname id
  async getChildren(geonameId: string) {
    try {
      const data = await this.axiosService.get<GlobalRegionDto>(
        `${this.globalRegionBaseUrl}/childrenJSON?geonameId=${geonameId}&username=${this.geonamesApiUsername}`,
      );

      console.log(data);

      if (data.totalResultsCount > 0) {
        return this._mapRegionToPayload(data);
      }
    } catch (error) {
      throw error;
    }
  }

  private _mapCountryToPayload<T extends GlobalCountryGeoNamesDetailDto[]>(
    data: T,
  ): GlobalRegionPayloadDto[] {
    return data.map((item: GlobalCountryGeoNamesDetailDto) => ({
      id: item.geonameId,
      name: item.countryName,
    })) as GlobalRegionPayloadDto[];
  }

  private _mapRegionToPayload<T extends GlobalRegionDto>(
    data: T,
  ): GlobalRegionPayloadDto[] {
    return data.geonames.map((item: GlobalRegionGeoNamesDetailDto) => ({
      id: item.geonameId,
      name: item.name,
    })) as GlobalRegionPayloadDto[];
  }
}
