import { loadCountryPhoneCodes } from '@apps/main/common/helpers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PhoneCodeDto } from './dto';

@Injectable()
export class PhoneCodeService {
  private phoneCodeData: PhoneCodeDto[];

  constructor(private readonly configService: ConfigService) {
    this.phoneCodeData = loadCountryPhoneCodes(this.configService);
  }

  getAllCountryPhoneCode() {
    return this.phoneCodeData;
  }
}
