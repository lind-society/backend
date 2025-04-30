import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { VillaPriceRule } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  CreateVillaPriceRuleDto,
  UpdateVillaPriceRuleDto,
  VillaPriceRuleDto,
  VillaPriceRuleWithRelationsDto,
} from './dto';

@Injectable()
export class VillaPriceRuleService {
  constructor(
    @InjectRepository(VillaPriceRule)
    private villaPriceRuleRepository: Repository<VillaPriceRule>,
  ) {}

  async create(payload: CreateVillaPriceRuleDto): Promise<VillaPriceRuleDto> {
    const villaPriceRule = this.villaPriceRuleRepository.create(payload);

    return await this.villaPriceRuleRepository.save(villaPriceRule);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPriceRuleWithRelationsDto[]>> {
    const paginatedVillaPriceRuleCategory = await paginate(
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
      },
    );

    return paginateResponseMapper(paginatedVillaPriceRuleCategory);
  }

  async findOne(id: string): Promise<VillaPriceRuleWithRelationsDto> {
    const villaPriceRule = await this.villaPriceRuleRepository.findOne({
      where: {
        id,
      },
    });

    if (!villaPriceRule) {
      throw new NotFoundException('villa price rule not found');
    }

    return villaPriceRule;
  }

  async update(
    id: string,
    payload: UpdateVillaPriceRuleDto,
  ): Promise<VillaPriceRuleWithRelationsDto> {
    await this.findOne(id);

    await this.villaPriceRuleRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.villaPriceRuleRepository.delete(id);
  }
}
