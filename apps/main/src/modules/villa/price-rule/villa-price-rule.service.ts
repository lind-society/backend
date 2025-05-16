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
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
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
    private eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateVillaPriceRuleDto): Promise<VillaPriceRuleDto> {
    const createdVillaPriceRule = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const createdVillaPriceRule = await manager.save(
          VillaPriceRule,
          payload,
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

    return createdVillaPriceRule;
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
        },
      },
    );

    const mappedPaginatedVillaPriceRule = paginatedVillaPriceRule.data.map(
      (villaPriceRule) => this._mapVillaPriceRuleData(villaPriceRule),
    );

    return paginateResponseMapper(
      paginatedVillaPriceRule,
      mappedPaginatedVillaPriceRule,
    );
  }

  async findOne(id: string): Promise<VillaPriceRuleWithRelationsDto> {
    const villaPriceRule = await this.villaPriceRuleRepository.findOne({
      where: {
        id,
      },
      relations: {
        villaPriceRules: { villa: true },
      },
    });

    if (!villaPriceRule) {
      throw new NotFoundException('villa price rule not found');
    }

    return this._mapVillaPriceRuleData(villaPriceRule);
  }

  async update(
    id: string,
    payload: UpdateVillaPriceRuleDto,
  ): Promise<VillaPriceRuleWithRelationsDto> {
    await this.findOne(id);

    const { villaIds, ...villaPriceRuleData } = payload;

    await this.datasource.transaction(async (manager) => {
      await this.villaPriceRuleRepository.update(id, villaPriceRuleData);

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
    });

    this.eventEmitter.emit(UPDATED_PRICE_RULE, id);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.datasource.transaction(async (manager) => {
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

  private _mapVillaPriceRuleData(
    villaPriceRule: VillaPriceRule,
  ): VillaPriceRuleWithRelationsDto {
    return plainToInstance(VillaPriceRuleWithRelationsDto, {
      ...omit(villaPriceRule, ['villaPriceRules']),

      villas: villaPriceRule.villaPriceRules.map(({ id, villa }) => ({
        pivotId: id,
        ...villa,
      })),
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
          qb.where(
            'priceRule.start_date <= :startDate AND priceRule.end_date >= :endDate',
          ).orWhere('pivot.id IS NULL');
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
}
