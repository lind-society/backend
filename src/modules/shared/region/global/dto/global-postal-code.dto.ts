export class GlobalPostalCodeDto {
  postalCodes: GlobalPostalCodeDetailDto[] | null;
}

export class GlobalPostalCodeDetailDto {
  adminCode2: string | null;
  adminCode1: string | null;
  adminName2: string | null;
  lng: number | null;
  countryCode: string | null;
  postalCode: string | null;
  adminName1: string | null;
  'ISO3166-2': string | null;
  placeName: string | null;
  lat: string | null;
}

export class GlobalPostalCodePayloadDto {
  name: string | null;
  postalCode: string | null;
  province: string | null;
  city: string | null;
}
