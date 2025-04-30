import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PhoneCodeDto } from 'src/modules/shared/region/phone-code/dto';

export function loadCountryPhoneCodes(
  configService: ConfigService,
): PhoneCodeDto[] {
  const countryCodePath = configService.get<string>('region.phoneCode');

  if (!fs.existsSync(countryCodePath)) {
    throw new InternalServerErrorException(
      `country-code.json file not found at ${countryCodePath}`,
    );
  }

  return JSON.parse(fs.readFileSync(countryCodePath, 'utf-8'));
}
