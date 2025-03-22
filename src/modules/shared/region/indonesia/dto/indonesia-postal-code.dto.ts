export class IndonesiaPostalCodeDto {
  statusCode: number | null;
  code: string | null;
  data: IndonesiaPostalCodeDataDto[] | null;
}

export class IndonesiaPostalCodeDataDto {
  code: number | null;
  village: string | null;
  district: string | null;
  regency: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  elevation: number | null;
  timezone: string | null;
}
