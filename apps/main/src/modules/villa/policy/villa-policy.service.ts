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
  VillaPolicyPaginationDto,
  VillaPolicyWithRelationsDto,
} from './dto';

@Injectable()
export class VillaPolicyService {
  constructor(
    @InjectRepository(VillaPolicy)
    private villaPolicyRepository: Repository<VillaPolicy>,
  ) {}

  async create(
    payload: CreateVillaPolicyDto,
  ): Promise<VillaPolicyWithRelationsDto> {
    const villaPolicyEntity = this.villaPolicyRepository.create(payload);

    const createdVillaPolicy =
      await this.villaPolicyRepository.save(villaPolicyEntity);

    return VillaPolicyWithRelationsDto.fromEntity(createdVillaPolicy);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPolicyPaginationDto[]>> {
    const paginatedVillaPolicies = await paginate(
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

    const villaPolicies = VillaPolicyPaginationDto.fromEntities(
      paginatedVillaPolicies.data,
    );

    return paginateResponseMapper(paginatedVillaPolicies, villaPolicies);
  }

  async findOne(id: string): Promise<VillaPolicyWithRelationsDto> {
    const villaPolicy = await this.villaPolicyRepository.findOne({
      where: {
        id,
      },
      relations: {
        type: true,
        villaPolicies: true,
      },
    });

    if (!villaPolicy) {
      throw new NotFoundException('villa policy not found');
    }

    return VillaPolicyWithRelationsDto.fromEntity(villaPolicy);
  }

  async update(
    id: string,
    payload: UpdateVillaPolicyDto,
  ): Promise<VillaPolicyWithRelationsDto> {
    await this.validateExist(id);

    await this.villaPolicyRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.villaPolicyRepository.delete(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.villaPolicyRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('villa policy not found');
    }
  }
}
