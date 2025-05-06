import { Villa } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { FacilityModule } from '../facility/facility.module';
import { FeatureModule } from '../feature/feature.module';
import { OwnerModule } from '../owner/owner.module';
import { VillaPolicyModule } from './policy/villa-policy.module';
import { VillaPriceRuleModule } from './price-rule/villa-price-rule.module';
import { VillaController } from './villa.controller';
import { VillaService } from './villa.service';

@Module({
  controllers: [VillaController],
  providers: [VillaService],
  imports: [
    TypeOrmModule.forFeature([Villa]),
    CurrencyModule,
    FacilityModule,
    FeatureModule,
    OwnerModule,
    VillaPolicyModule,
    VillaPriceRuleModule,
  ],
  exports: [VillaService],
})
export class VillaModule {}
