import { continents } from '@apps/main/common/constants';
import { extractLatLngFromGoogleMapsUrl } from '@apps/main/common/helpers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from '../../axios/axios.service';
import {
  CoordinateDto,
  GlobalCountryGeoNamesDetailDto,
  GlobalCountryGeoNamesDto,
  GlobalPostalCodeDetailDto,
  GlobalPostalCodeDto,
  GlobalPostalCodePayloadDto,
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

      if (data.totalResultsCount > 0) {
        return this._mapRegionToPayload(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async getPostalCode(
    provinceCode: string,
    secondaryProvinceCode?: string,
    subDistrict?: string,
    district?: string,
    city?: string,
  ): Promise<GlobalPostalCodePayloadDto[] | null> {
    try {
      const searchLevels = [
        { name: 'subDistrict', value: subDistrict },
        { name: 'district', value: district },
        { name: 'city', value: city },
      ];

      for (const level of searchLevels) {
        if (!level.value) continue;

        const result = await this.axiosService.get<GlobalPostalCodeDto>(
          `${this.globalPostalCodeBaseUrl}/postalCodeSearchJSON?placename=${level.value}&adminCode1=${provinceCode}&username=${this.geonamesApiUsername}`,
        );

        if (result.postalCodes.length > 0) {
          return this._mapPostalCodeToPayload(result);
        }

        if (secondaryProvinceCode && secondaryProvinceCode !== provinceCode) {
          const secondaryResult =
            await this.axiosService.get<GlobalPostalCodeDto>(
              `${this.globalPostalCodeBaseUrl}/postalCodeSearchJSON?placename=${level.value}&adminCode1=${secondaryProvinceCode}&username=${this.geonamesApiUsername}`,
            );

          if (secondaryResult.postalCodes.length > 0) {
            return this._mapPostalCodeToPayload(secondaryResult);
          }
        }
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  // Extract Longitude and Latitude from Google Map Link
  async getCoordinatesFromShortLink(shortUrl: string): Promise<CoordinateDto> {
    const longUrl = await this.axiosService.getRedirectUrl(shortUrl);

    const coordinates = extractLatLngFromGoogleMapsUrl(longUrl);

    if (coordinates) {
      return coordinates;
    } else {
      throw new BadRequestException('invalid google map url format');
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
      provinceCode: item.adminCode1,
      secondaryProvinceCode: item.adminCodes1?.ISO3166_2 || null,
    })) as GlobalRegionPayloadDto[];
  }

  private _mapPostalCodeToPayload<T extends GlobalPostalCodeDto>(
    data: T,
  ): GlobalPostalCodePayloadDto[] {
    return data.postalCodes.map((item: GlobalPostalCodeDetailDto) => ({
      name: item.placeName,
      postalCode: item.postalCode,
      province: item.adminName1 ?? '',
      city: item.adminName2 ?? '',
    })) as GlobalPostalCodePayloadDto[];
  }
}
