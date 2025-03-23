export class GlobalRegionDto {
  totalResultsCount: number | null;
  geonames: GlobalRegionGeoNamesDetailDto[] | null;
}

export class GlobalRegionGeoNamesDetailDto {
  adminCode1: string | null;
  lng: string | null;
  geonameId: number | null;
  toponymName: string | null;
  countryId: string | null;
  fcl: string | null;
  population: number | null;
  countryCode: string | null;
  name: string | null;
  fclName: string | null;
  adminCodes1: Record<string, string> | null;
  countryName: string | null;
  fcodeName: string | null;
  adminName1: string | null;
  lat: string | null;
  fcode: string | null;
}

export class GlobalRegionPayloadDto {
  id: number | null;
  name: string | null;
}
