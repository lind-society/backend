import { Property } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { FeatureModule } from '../feature/feature.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [
    TypeOrmModule.forFeature([Property]),
    CurrencyModule,
    FeatureModule,
  ],
  exports: [PropertyService],
})
export class PropertyModule {}
