import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Additional } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  AdditionalPaginationDto,
  AdditionalWithRelationsDto,
  CreateAdditionalDto,
  UpdateAdditionalDto,
} from './dto';

@Injectable()
export class AdditionalService {
  constructor(
    @InjectRepository(Additional)
    private additionalRepository: Repository<Additional>,
  ) {}

  async create(
    payload: CreateAdditionalDto,
  ): Promise<AdditionalWithRelationsDto> {
    const additionalEntity = this.additionalRepository.create(payload);

    const createdAdditional =
      await this.additionalRepository.save(additionalEntity);

    return AdditionalWithRelationsDto.fromEntity(createdAdditional);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<AdditionalPaginationDto[]>> {
    const paginatedAdditionals = await paginate(
      query,
      this.additionalRepository,
      {
        select: ['id', 'name', 'photos', 'description', 'type'],
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
        relations: {
          propertyAdditionals: { property: true },
          villaAdditionals: { villa: true },
        },
      },
    );

    const additionals = AdditionalPaginationDto.fromEntities(
      paginatedAdditionals.data,
    );

    return paginateResponseMapper(paginatedAdditionals, additionals);
  }

  async findOne(id: string): Promise<AdditionalWithRelationsDto> {
    const additional = await this.additionalRepository.findOne({
      select: {
        id: true,
        name: true,
        photos: true,
        description: true,
        type: true,
      },
      where: {
        id,
      },
    });

    if (!additional) {
      throw new NotFoundException('additional not found');
    }

    return additional;
  }

  async update(
    id: string,
    payload: UpdateAdditionalDto,
  ): Promise<AdditionalWithRelationsDto> {
    await this.validateExist(id);

    await this.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.remove(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.additionalRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('additional not found');
    }
  }
}
