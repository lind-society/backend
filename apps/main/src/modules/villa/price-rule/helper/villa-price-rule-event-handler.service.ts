import {
  CREATED_PRICE_RULE,
  DELETED_PRICE_RULE,
  UPDATED_PRICE_RULE,
} from '@apps/main/common/constants';
import { Villa } from '@apps/main/database/entities';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { VillaPriceService } from './villa-price.service';

@Injectable()
export class VillaPriceRuleEventHandlerService {
  private logger = new Logger(VillaPriceRuleEventHandlerService.name);

  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    private villaPriceService: VillaPriceService,
  ) {}

  @OnEvent(CREATED_PRICE_RULE, { async: true })
  async handleCreatedPriceRule(id: string) {
    await this.datasource.transaction(async (entityManager) => {
      await this.villaPriceService.updateVillaPrices(id, entityManager);
    });
  }

  @OnEvent(UPDATED_PRICE_RULE, { async: true })
  async handleUpdatedPriceRule(id: string) {
    await this.datasource.transaction(async (entityManager) => {
      await this.villaPriceService.updateVillaPrices(id, entityManager);
    });
  }

  @OnEvent(DELETED_PRICE_RULE, { async: true })
  async handleDeletedPriceRule(villaIds: string[]) {
    await this.datasource.transaction(async (entityManager) => {
      for (const villaId of villaIds) {
        await this.villaPriceService.recalculateVillaPrices(
          villaId,
          entityManager,
        );
      }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updatePriceDaily(): Promise<void> {
    this.logger.log(
      'Updating Villa Pricing based on Price Rule (Daily at Midnight)',
    );

    await this.datasource.transaction(async (entityManager) => {
      const villas = await entityManager
        .getRepository(Villa)
        .createQueryBuilder('villa')
        .innerJoin('villa.villaPriceRules', 'vpr')
        .innerJoin('vpr.priceRule', 'pr')
        .where('pr.is_active = :isActive', { isActive: true })
        .getMany();

      if (villas.length > 0) {
        for (const villa of villas) {
          await this.villaPriceService.recalculateVillaPrices(
            villa.id,
            entityManager,
          );
        }
      }

      this.logger.log(`Updated ${villas.length} Villas`);
    });
  }
}
