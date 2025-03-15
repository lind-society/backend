import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConverter } from 'src/database/entities';
import { CurrencyConverterController } from './currency-converter.controller';
import { CurrencyConverterService } from './currency-converter.service';

@Module({
  controllers: [CurrencyConverterController],
  providers: [CurrencyConverterService],
  imports: [TypeOrmModule.forFeature([CurrencyConverter])],
})
export class CurrencyConverterModule {}
