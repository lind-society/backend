import { CoordinateDto } from '@apps/main/modules/shared/region/global/dto';

// Extract Longitude and Latitude from Google Map Link
export function extractLatLngFromGoogleMapsUrl(url: string): CoordinateDto {
  const regex = /@([0-9.-]+),([0-9.-]+)/;
  const matches = url.match(regex);

  if (matches && matches.length >= 3) {
    const latitude = parseFloat(matches[1]);
    const longitude = parseFloat(matches[2]);
    return { latitude, longitude };
  }
  return null;
}
