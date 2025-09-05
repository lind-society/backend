import {
  CREATED_PRICE_RULE,
  DELETED_PRICE_RULE,
  UPDATED_PRICE_RULE,
} from '@apps/main/common/constants';
import {
  convertDatetimeToDate,
  paginateResponseMapper,
} from '@apps/main/common/helpers';
import {
  DiscountType,
  Villa,
  VillaPriceRule,
  VillaPriceRulePivot,
} from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../../currency/currency.service';
import {
  AvailableVillaDto,
  CreateVillaPriceRuleDto,
  GetAffectedVillaDto,
  GetUnavailableVillaDto,
  GetVillaWithPriceRuleDto,
  UpdateVillaPriceRuleDto,
  VillaPriceRuleDto,
  VillaPriceRuleWithRelationsDto,
  VillaWithPriceRuleDto,
} from './dto';

@Injectable()
export class VillaPriceRuleService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(VillaPriceRule)
    private villaPriceRuleRepository: Repository<VillaPriceRule>,
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
    private currencyService: CurrencyService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateVillaPriceRuleDto): Promise<VillaPriceRuleDto> {
    this._handleDefaultDiscountType(payload);

    const createdVillaPriceRule = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const adjustedDateTimeRangeBasePriceVillaPriceRuleData =
          await this._setDateTimeRange(payload);

        const convertedBasePriceVillaPriceRuleData =
          await this._convertToBaseCurrency(
            adjustedDateTimeRangeBasePriceVillaPriceRuleData,
          );

        const createdVillaPriceRule = await manager.save(
          VillaPriceRule,
          convertedBasePriceVillaPriceRuleData,
        );

        // validation for checking villa is not included in other villa price rule for the inputted start - end date
        if (Array.isArray(payload.villaIds) && payload.villaIds.length > 0) {
          const availableVillaValidationPayload: GetUnavailableVillaDto = {
            startDate: payload.startDate,
            endDate: payload.endDate,
            ids: payload.villaIds,
          };

          await this.validateAvailableVillasWithinDate(
            availableVillaValidationPayload,
            manager,
          );

          await manager.save(
            VillaPriceRulePivot,
            payload.villaIds.map((villaId: string) => ({
              priceRuleId: createdVillaPriceRule.id,
              villaId,
            })),
          );
        }

        return createdVillaPriceRule;
      },
    );

    this.eventEmitter.emit(CREATED_PRICE_RULE, createdVillaPriceRule.id);

    return VillaPriceRuleWithRelationsDto.fromEntity(createdVillaPriceRule);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPriceRuleWithRelationsDto[]>> {
    const paginatedVillaPriceRule = await paginate(
      query,
      this.villaPriceRuleRepository,
      {
        sortableColumns: ['createdAt', 'name'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name'],
        relations: {
          villaPriceRules: { villa: true },
          currency: true,
        },
      },
    );

    const mappedPaginatedVillaPriceRule =
      VillaPriceRuleWithRelationsDto.fromEntities(paginatedVillaPriceRule.data);

    await Promise.all(
      mappedPaginatedVillaPriceRule.map(async (villaPriceRule) => {
        villaPriceRule.isAppliedToAllVilla =
          await this._isCurrentPriceRuleAppliedToAllVilla(
            villaPriceRule.villas.length,
          );
      }),
    );

    return paginateResponseMapper(
      paginatedVillaPriceRule,
      mappedPaginatedVillaPriceRule,
    );
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<VillaPriceRuleWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(VillaPriceRule)
      : this.villaPriceRuleRepository;

    const villaPriceRule = await repository.findOne({
      where: {
        id,
      },
      relations: {
        villaPriceRules: { villa: true },
        currency: true,
      },
    });

    if (!villaPriceRule) {
      throw new NotFoundException('villa price rule not found');
    }

    const mappedVillaPriceRule =
      VillaPriceRuleWithRelationsDto.fromEntity(villaPriceRule);

    mappedVillaPriceRule.isAppliedToAllVilla =
      await this._isCurrentPriceRuleAppliedToAllVilla(
        villaPriceRule.villaPriceRules.length,
        entityManager,
      );

    return mappedVillaPriceRule;
  }

  async update(
    id: string,
    payload: UpdateVillaPriceRuleDto,
  ): Promise<VillaPriceRuleWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    const { villaIds, ...villaPriceRuleData } = payload;

    return await this.datasource.transaction(async (manager) => {
      await this.findOne(id, manager);

      const adjustedDateTimeRangeBasePriceVillaPriceRuleData =
        await this._setDateTimeRange(villaPriceRuleData);

      const convertedBasePriceVillaPriceRuleData =
        await this._convertToBaseCurrency(
          adjustedDateTimeRangeBasePriceVillaPriceRuleData,
        );

      await this.villaPriceRuleRepository.update(
        id,
        convertedBasePriceVillaPriceRuleData,
      );

      if (Array.isArray(villaIds)) {
        await manager.delete(VillaPriceRulePivot, { priceRuleId: id });

        if (villaIds.length > 0) {
          const availableVillaValidationPayload: GetUnavailableVillaDto = {
            startDate: payload.startDate,
            endDate: payload.endDate,
            ids: villaIds,
          };

          await this.validateAvailableVillasWithinDate(
            availableVillaValidationPayload,
            manager,
          );

          await manager.save(
            VillaPriceRulePivot,
            villaIds.map((villaId: string) => ({
              priceRuleId: id,
              villaId,
            })),
          );
        }
      }
      this.eventEmitter.emit(UPDATED_PRICE_RULE, id);

      return this.findOne(id, manager);
    });
  }

  async remove(id: string): Promise<void> {
    await this.datasource.transaction(async (manager) => {
      await this.findOne(id, manager);

      const affectedVillas: GetAffectedVillaDto[] = await manager
        .getRepository(VillaPriceRule)
        .createQueryBuilder('priceRule')
        .innerJoin('priceRule.villaPriceRules', 'vpr')
        .innerJoin('vpr.villa', 'villa')
        .select('villa.id', 'villaID')
        .getRawMany();

      const affectedVillaIds = affectedVillas.map((villa) => villa.villaId);

      await manager.delete(VillaPriceRule, id);

      this.eventEmitter.emit(DELETED_PRICE_RULE, affectedVillaIds);
    });
  }

  // Helper Functions
  async findAvailableVillasWithinDate(
    query: PaginateQuery,
    payload: GetVillaWithPriceRuleDto,
  ): Promise<PaginateResponseDataProps<AvailableVillaDto[]>> {
    const queryBuilder = this.villaRepository
      .createQueryBuilder('villa')
      .distinct(true)
      .leftJoin('villa.villaPriceRules', 'pivot')
      .leftJoin('pivot.priceRule', 'priceRule')
      .where(
        // Keep villas where there's no overlap OR no priceRule at all
        new Brackets((qb) => {
          qb.where('pivot.id IS NULL').orWhere(
            'priceRule.end_date < :startDate OR priceRule.start_date > :endDate',
          );
        }),
      )
      .setParameters({
        startDate: payload.startDate,
        endDate: payload.endDate,
      });

    const availableVillas = await paginate(query, queryBuilder, {
      sortableColumns: ['createdAt', 'name'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name'],
    });

    const mappedAvailableVillas = availableVillas.data.map(
      (availableVilla) => ({
        id: availableVilla.id,
        name: availableVilla.name,
        address: availableVilla.address,
        city: availableVilla.city,
        state: availableVilla.state,
        country: availableVilla.country,
      }),
    );

    return paginateResponseMapper(availableVillas, mappedAvailableVillas);
  }

  async validateAvailableVillasWithinDate(
    payload: GetUnavailableVillaDto,
    manager: EntityManager,
  ): Promise<void> {
    if (payload.ids) {
      const unavailableVillasWithinDateRange: VillaWithPriceRuleDto[] =
        await manager
          .createQueryBuilder(Villa, 'villa')
          .distinct(true)
          .innerJoin('villa.villaPriceRules', 'pivot')
          .innerJoin('pivot.priceRule', 'priceRule')
          .select([
            'villa.id AS id',
            'villa.name AS name',
            'priceRule.start_date AS "priceRuleStartDate"',
            'priceRule.end_date AS "priceRuleEndDate"',
          ])
          .where('villa.id IN (:...villaIds)', { villaIds: payload.ids })
          .andWhere(
            new Brackets((qb) => {
              qb.where(
                '(priceRule.start_date <= :endDate AND priceRule.end_date >= :startDate)',
              );
            }),
          )
          .setParameters({
            startDate: payload.startDate,
            endDate: payload.endDate,
          })
          .getRawMany();

      const unavailableVillas = unavailableVillasWithinDateRange.filter(
        (villa) => payload.ids.includes(villa.id),
      );

      if (unavailableVillas && unavailableVillas.length > 0) {
        throw new BadRequestException(
          this._constructUnavailableVillaMessage(unavailableVillas[0]),
        );
      }
    }
  }

  private _constructUnavailableVillaMessage(
    payload: VillaWithPriceRuleDto,
  ): string {
    return `villa ${payload.name} has applied another price rule in date range ${convertDatetimeToDate(payload.priceRuleStartDate)} - ${convertDatetimeToDate(payload.priceRuleEndDate)}`;
  }

  private async _setDateTimeRange(
    villaPriceRuleData: CreateVillaPriceRuleDto | UpdateVillaPriceRuleDto,
  ): Promise<CreateVillaPriceRuleDto | UpdateVillaPriceRuleDto> {
    if (!villaPriceRuleData.startDate || !villaPriceRuleData.endDate) {
      return villaPriceRuleData;
    }

    const startDate = new Date(villaPriceRuleData.startDate);
    const endDate = new Date(villaPriceRuleData.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      ...villaPriceRuleData,
      startDate,
      endDate,
    };
  }

  private async _convertToBaseCurrency(
    villaPriceRuleData: CreateVillaPriceRuleDto | UpdateVillaPriceRuleDto,
  ): Promise<CreateVillaPriceRuleDto | UpdateVillaPriceRuleDto> {
    return {
      ...villaPriceRuleData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      discount:
        villaPriceRuleData.discountType === DiscountType.Fixed
          ? await this.currencyService.convertToBaseCurrency(
              villaPriceRuleData.currencyId,
              villaPriceRuleData.discount,
            )
          : villaPriceRuleData.discount,
    };
  }

  private async _handleDefaultDiscountType(
    payload: CreateVillaPriceRuleDto | UpdateVillaPriceRuleDto,
  ) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }

  private async _totalVillaCount(entityManager?: EntityManager) {
    const repository = entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;

    const totalVilla = await repository.count();

    return totalVilla;
  }

  private async _isCurrentPriceRuleAppliedToAllVilla(
    villasCount: number,
    entityManager?: EntityManager,
  ) {
    const totalVilla = await this._totalVillaCount(entityManager);

    return villasCount === totalVilla;
  }
}
