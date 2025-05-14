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
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import {
  CreateVillaPriceRuleDto,
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
    private datasource: DataSource,
    @InjectRepository(VillaPriceRule)
    private villaPriceRuleRepository: Repository<VillaPriceRule>,
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
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

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.villaPriceRuleRepository.delete(id);
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
  async findAvailableVillasWithinDate(payload: GetVillaWithPriceRuleDto) {
    const availableVillas: VillaWithPriceRuleDto[] = await this.villaRepository
      .createQueryBuilder('villa')
      .distinct(true)
      .leftJoin('villa.villaPriceRules', 'pivot')
      .leftJoin('pivot.priceRule', 'priceRule')
      .select([
        'villa.id AS id',
        'villa.name AS name',
        'priceRule.start_date AS "priceRuleStartDate"',
        'priceRule.end_date AS "priceRuleEndDate"',
      ])
      .where(
        // Keep villas where there's no overlap OR no priceRule at all
        new Brackets((qb) => {
          qb.where('priceRule.id IS NULL') // no price rule
            .orWhere(
              new Brackets((qb2) => {
                qb2
                  .where('priceRule.start_date > :endDate')
                  .orWhere('priceRule.end_date < :startDate');
              }),
            );
        }),
      )
      .setParameters({
        startDate: payload.startDate,
        endDate: payload.endDate,
      })
      .getRawMany();

    return availableVillas;
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
          .leftJoin('villa.villaPriceRules', 'pivot')
          .leftJoin('pivot.priceRule', 'priceRule')
          .select([
            'villa.id AS id',
            'villa.name AS name',
            'priceRule.start_date AS "priceRuleStartDate"',
            'priceRule.end_date AS "priceRuleEndDate"',
          ])
          .where(
            // Keep villas where there's no overlap OR no priceRule at all
            new Brackets((qb) => {
              qb.where('priceRule.id IS NOT NULL') // no price rule
                .andWhere(
                  new Brackets((qb2) => {
                    qb2
                      .where('priceRule.start_date <= :endDate') // ends before priceRule
                      .andWhere('priceRule.end_date >= :startDate'); // starts after priceRule
                  }),
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
