/**
 * Constructs a full phone number string by combining the country code and the local phone number.
 *
 * - Removes the "+" sign from the country code.
 * - Concatenates the trimmed country code with the local phone number.
 *
 * @param {string} phoneCountryCode - The country calling code (e.g., "+62").
 * @param {string} phoneNumber - The local phone number (e.g., "81234567890").
 * @returns {string} The full phone number in international format without "+" (e.g., "6281234567890").
 *
 * @example
 * constructPhoneNumber('+62', '81234567890');
 * return : '6281234567890'
 */

export function constructPhoneNumber(
  phoneCountryCode: string,
  phoneNumber: string,
): string {
  if (!phoneCountryCode || !phoneNumber) {
    return '';
  }

  return `${phoneCountryCode.replace('+', '')}${phoneNumber}`;
}
