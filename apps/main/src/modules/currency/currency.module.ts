import { Currency } from '@apps/main/database/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConverterModule } from './converter/currency-converter.module';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Global()
@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  imports: [TypeOrmModule.forFeature([Currency]), CurrencyConverterModule],
  exports: [CurrencyService, CurrencyConverterModule],
})
export class CurrencyModule {}
