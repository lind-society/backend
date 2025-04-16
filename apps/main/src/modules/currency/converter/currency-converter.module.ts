import { CurrencyConverter } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConverterController } from './currency-converter.controller';
import { CurrencyConverterService } from './currency-converter.service';

@Module({
  controllers: [CurrencyConverterController],
  providers: [CurrencyConverterService],
  imports: [TypeOrmModule.forFeature([CurrencyConverter])],
  exports: [CurrencyConverterService],
})
export class CurrencyConverterModule {}
