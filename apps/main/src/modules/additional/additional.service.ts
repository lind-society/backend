import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Additional } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  AdditionalDto,
  AdditionalWithRelationsDto,
} from './dto/additional.dto';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { UpdateAdditionalDto } from './dto/update-additional.dto';

@Injectable()
export class AdditionalService {
  constructor(
    @InjectRepository(Additional)
    private additionalRepository: Repository<Additional>,
  ) {}

  async create(payload: CreateAdditionalDto): Promise<AdditionalDto> {
    const additional = this.additionalRepository.create(payload);

    return await this.additionalRepository.save(additional);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<AdditionalWithRelationsDto[]>> {
    const paginatedAdditionalCategory = await paginate(
      query,
      this.additionalRepository,
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

    return paginateResponseMapper(paginatedAdditionalCategory);
  }

  async findOne(id: string): Promise<AdditionalWithRelationsDto> {
    const additional = await this.additionalRepository.findOne({
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
    await this.findOne(id);

    await this.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.remove(id);
  }
}
