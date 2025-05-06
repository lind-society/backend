import { Villa, VillaPriceRule } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPriceRuleController } from './villa-price-rule.controller';
import { VillaPriceRuleService } from './villa-price-rule.service';

@Module({
  controllers: [VillaPriceRuleController],
  providers: [VillaPriceRuleService],
  imports: [TypeOrmModule.forFeature([VillaPriceRule, Villa])],
})
export class VillaPriceRuleModule {}
