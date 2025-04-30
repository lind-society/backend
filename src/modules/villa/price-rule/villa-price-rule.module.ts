import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Villa, VillaPriceRule } from 'src/database/entities';
import { VillaPriceRuleController } from './villa-price-rule.controller';
import { VillaPriceRuleService } from './villa-price-rule.service';

@Module({
  controllers: [VillaPriceRuleController],
  providers: [VillaPriceRuleService],
  imports: [TypeOrmModule.forFeature([VillaPriceRule, Villa])],
})
export class VillaPriceRuleModule {}
