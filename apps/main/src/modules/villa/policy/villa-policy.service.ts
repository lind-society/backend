import { paginateResponseMapper } from '@apps/main/common/helpers';
import { VillaPolicy } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  CreateVillaPolicyDto,
  UpdateVillaPolicyDto,
  VillaPolicyDto,
  VillaPolicyWithRelationsDto,
} from './dto';

@Injectable()
export class VillaPolicyService {
  constructor(
    @InjectRepository(VillaPolicy)
    private villaPolicyRepository: Repository<VillaPolicy>,
  ) {}
  async create(payload: CreateVillaPolicyDto): Promise<VillaPolicyDto> {
    const villaPolicy = this.villaPolicyRepository.create(payload);

    return await this.villaPolicyRepository.save(villaPolicy);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPolicyWithRelationsDto[]>> {
    const paginatedVillaPolicyCategory = await paginate(
      query,
      this.villaPolicyRepository,
      {
        sortableColumns: ['createdAt', 'name', 'type'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          type: [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name'],
      },
    );

    return paginateResponseMapper(paginatedVillaPolicyCategory);
  }

  async findOne(id: string): Promise<VillaPolicyWithRelationsDto> {
    const villaPolicy = await this.villaPolicyRepository.findOne({
      where: {
        id,
      },
    });

    if (!villaPolicy) {
      throw new NotFoundException('villaPolicy not found');
    }

    return villaPolicy;
  }

  async update(
    id: string,
    payload: UpdateVillaPolicyDto,
  ): Promise<VillaPolicyWithRelationsDto> {
    await this.findOne(id);

    await this.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.remove(id);
  }
}
