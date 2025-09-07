import { Villa, VillaPriceRule } from '@apps/main/database/entities';
import { VillaPriceRuleView } from '@apps/main/database/entities/views/villa-price-rule.view.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../../currency/currency.module';
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
  imports: [
    TypeOrmModule.forFeature([VillaPriceRule, VillaPriceRuleView, Villa]),
    CurrencyModule,
  ],
})
export class VillaPriceRuleModule {}
