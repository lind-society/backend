import { Villa, VillaPriceRule } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPriceRuleEventHandlerService } from './helper/villa-price-rule-event-handler.service';
import { VillaPriceService } from './helper/villa-price.service';
import { VillaPriceRuleController } from './villa-price-rule.controller';
import { VillaPriceRuleService } from './villa-price-rule.service';

@Module({
  controllers: [VillaPriceRuleController],
  providers: [
    VillaPriceRuleService,
    VillaPriceService,
    VillaPriceRuleEventHandlerService,
  ],
  imports: [TypeOrmModule.forFeature([VillaPriceRule, Villa])],
})
export class VillaPriceRuleModule {}
