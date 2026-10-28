import { CoordinateDto } from '@apps/main/modules/shared/region/global/dto';

// Extract Longitude and Latitude from Google Map Link. Handles both the
// "@lat,lng" pattern from a place/directions URL and the "q=lat,lng" /
// "ll=lat,lng" pattern from a plain pin-drop link (e.g. maps.google.com/?q=…) —
// real listing data uses both, and only supporting the first left every
// "?q=" link 400ing on the coordinates endpoint.
const COORDINATE_PATTERNS = [
  /@(-?[0-9.]+),(-?[0-9.]+)/,
  /[?&](?:q|ll|query)=(-?[0-9.]+),(-?[0-9.]+)/,
];

export function extractLatLngFromGoogleMapsUrl(url: string): CoordinateDto {
  for (const regex of COORDINATE_PATTERNS) {
    const matches = url.match(regex);
    if (matches && matches.length >= 3) {
      return { latitude: parseFloat(matches[1]), longitude: parseFloat(matches[2]) };
    }
  }
  return null;
}
