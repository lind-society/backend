import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { FacilityModule } from '../facility/facility.module';
import { FeatureModule } from '../feature/feature.module';
import { OwnerModule } from '../owner/owner.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [
    TypeOrmModule.forFeature([Property]),
    CurrencyModule,
    FacilityModule,
    FeatureModule,
    OwnerModule,
  ],
})
export class PropertyModule {}
