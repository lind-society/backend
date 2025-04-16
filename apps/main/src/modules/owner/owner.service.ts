import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Owner } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  CreateOwnerDto,
  OwnerDto,
  OwnerWithRelationDto,
  UpdateOwnerDto,
} from './dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
  ) {}

  async create(payload: CreateOwnerDto): Promise<OwnerDto> {
    const owner = this.ownerRepository.create(payload);

    const savedOwner = await this.ownerRepository.save(owner);

    return plainToInstance(OwnerDto, savedOwner);
  }

  async findAll(query: PaginateQuery) {
    const paginatedOwner = await paginate(query, this.ownerRepository, {
      sortableColumns: ['createdAt', 'name', 'type', 'status'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      filterableColumns: {
        type: [FilterOperator.EQ],
        status: [FilterOperator.EQ],
        phoneNumber: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name', 'companyName', 'email', 'address', 'website'],
      relations: {
        activities: true,
        properties: true,
        villas: true,
      },
    });

    return paginateResponseMapper(paginatedOwner);
  }

  async findOne(id: string): Promise<OwnerWithRelationDto> {
    const owner = await this.ownerRepository.findOne({
      where: { id },
      relations: {
        activities: true,
        properties: true,
        villas: true,
      },
    });

    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    return plainToInstance(OwnerDto, owner);
  }

  async update(
    id: string,
    payload: UpdateOwnerDto,
  ): Promise<OwnerWithRelationDto> {
    await this.findOne(id);

    await this.ownerRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.ownerRepository.delete(id);
  }
}
