import { Module } from '@nestjs/common';
import { PhoneCodeService } from './phone-code.service';

@Module({
  providers: [PhoneCodeService],
  exports: [PhoneCodeService],
})
export class PhoneCodeModule {}
