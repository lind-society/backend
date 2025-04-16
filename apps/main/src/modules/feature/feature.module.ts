import { Feature } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { FeatureService } from './feature.service';

@Module({
  providers: [FeatureService],
  imports: [TypeOrmModule.forFeature([Feature]), CurrencyModule],
  exports: [FeatureService],
})
export class FeatureModule {}
