import { CONTINENTS } from '@apps/main/common/constants';
import { extractLatLngFromGoogleMapsUrl } from '@apps/main/common/helpers';
import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
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
  private readonly logger = new Logger(GlobalRegionService.name);

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
    return CONTINENTS;
  }

  async getCountry(continendCode: string) {
    try {
      const data = await this.axiosService.get<GlobalCountryGeoNamesDto>(
        `${this.globalRegionBaseUrl}/countryInfoJSON?username=${this.geonamesApiUsername}`,
      );

      this._assertGeoNamesResponse(data, 'geonames', 'load countries');

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

      this._assertGeoNamesResponse(data, 'geonames', 'load regions');

      // An empty result is a legitimate answer (a country with no children at
      // this level); returning `undefined` made it indistinguishable from a
      // failure to whoever called it.
      return this._mapRegionToPayload(data);
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

        this._assertGeoNamesResponse(result, 'postalCodes', 'load postal codes');

        if (result.postalCodes.length > 0) {
          return this._mapPostalCodeToPayload(result);
        }

        if (secondaryProvinceCode && secondaryProvinceCode !== provinceCode) {
          const secondaryResult =
            await this.axiosService.get<GlobalPostalCodeDto>(
              `${this.globalPostalCodeBaseUrl}/postalCodeSearchJSON?placename=${level.value}&adminCode1=${secondaryProvinceCode}&username=${this.geonamesApiUsername}`,
            );

          this._assertGeoNamesResponse(
            secondaryResult,
            'postalCodes',
            'load postal codes',
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

  /**
   * GeoNames answers HTTP 200 even when it refuses the request: a bad or
   * over-quota username comes back as `{status: {message, value}}` with none of
   * the data keys present. Reading straight through that produced "Cannot read
   * properties of undefined" and a bare 500 — which told an admin staring at an
   * empty country dropdown nothing at all.
   *
   * The most common cause by far is `GEONAMES_API_USERNAME` still being the
   * shared `demo` account, whose daily quota is permanently exhausted.
   */
  private _assertGeoNamesResponse(
    data: unknown,
    expectedKey: string,
    action: string,
  ): void {
    const upstreamMessage = (
      data as { status?: { message?: string } } | undefined
    )?.status?.message;

    if (upstreamMessage) {
      this.logger.error(`geonames refused to ${action}: ${upstreamMessage}`);

      throw new ServiceUnavailableException(
        `failed to ${action}, the region provider rejected the request: ${upstreamMessage}`,
      );
    }

    if (!Array.isArray((data as Record<string, unknown>)?.[expectedKey])) {
      this.logger.error(
        `geonames returned no "${expectedKey}" while trying to ${action}`,
      );

      throw new ServiceUnavailableException(
        `failed to ${action}, the region provider returned an unexpected response`,
      );
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
