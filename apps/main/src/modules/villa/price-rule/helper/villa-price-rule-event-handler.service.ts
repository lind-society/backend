import {
  CREATED_PRICE_RULE,
  DELETED_PRICE_RULE,
  UPDATED_PRICE_RULE,
} from '@apps/main/common/constants';
import { Villa } from '@apps/main/database/entities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { VillaPriceService } from './villa-price.service';

@Injectable()
export class VillaPriceRuleEventHandlerService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    private villaPriceService: VillaPriceService,
  ) {}

  @OnEvent(CREATED_PRICE_RULE)
  async handleCreatedPriceRule(id: string) {
    console.log('price rule created');
    await this.datasource.transaction(async (entityManager) => {
      await this.villaPriceService.updateVillaPrices(id, entityManager);
    });
  }

  @OnEvent(UPDATED_PRICE_RULE)
  async handleUpdatedPriceRule(id: string) {
    console.log('price rule updated');
    await this.datasource.transaction(async (entityManager) => {
      await this.villaPriceService.updateVillaPrices(id, entityManager);
    });
  }

  @OnEvent(DELETED_PRICE_RULE)
  async handleDeletedPriceRule(villaIds: string[]) {
    console.log('price rule deleted');
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
    console.log('called');
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
    });
  }
}
