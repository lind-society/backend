import { PhoneCodeDto } from '@apps/main/modules/shared/region/phone-code/dto';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export function loadCountryPhoneCodes(
  configService: ConfigService,
): PhoneCodeDto[] {
  const countryCodePath = configService.get<string>('region.phoneCode');

  const countryCodeResolvedPath = path.resolve(process.cwd(), countryCodePath);

  if (!fs.existsSync(countryCodeResolvedPath)) {
    throw new InternalServerErrorException(
      `country-code.json file not found at ${countryCodeResolvedPath}`,
    );
  }

  return JSON.parse(fs.readFileSync(countryCodeResolvedPath, 'utf-8'));
}
