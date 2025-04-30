export class GlobalCountryGeoNamesDto {
  geonames: GlobalCountryGeoNamesDetailDto[] | null;
}

export class GlobalCountryGeoNamesDetailDto {
  continent: string | null;
  geonameId: number | null;
  capiztal: string | null;
  languages: string | null;
  north: number | null;
  west: number | null;
  south: number | null;
  east: number | null;
  isoAlpha3: string | null;
  fipsCode: string | null;
  population: string | null;
  isoNumeric: string | null;
  areaInSqKm: string | null;
  countryCode: string | null;
  countryName: string | null;
  postalCodeFormat: string | null;
  continentName: string | null;
  currencyCode: string | null;
}
