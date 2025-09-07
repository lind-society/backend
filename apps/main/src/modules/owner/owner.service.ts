import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Owner } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateOwnerDto,
  OwnerPaginationDto,
  OwnerWithRelationsDto,
  UpdateOwnerDto,
} from './dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
  ) {}

  async create(payload: CreateOwnerDto): Promise<OwnerWithRelationsDto> {
    const ownerEntity = this.ownerRepository.create(payload);

    const createdOwner = await this.ownerRepository.save(ownerEntity);

    return OwnerWithRelationsDto.fromEntity(createdOwner);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<OwnerPaginationDto[]>> {
    const paginatedOwners = await paginate(query, this.ownerRepository, {
      select: [
        'id',
        'name',
        'type',
        'companyName',
        'phoneCountryCode',
        'phoneNumber',
        'email',
        'address',
        'website',
        'status',
        'createdAt',

        'activities.id',
        'activities.name',
        'activities.highlight',
        'activities.category.id',
        'activities.category.name',

        'properties.id',
        'properties.name',
        'properties.highlight',

        'villas.id',
        'villas.name',
        'villas.highlight',
      ],
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
        activities: { category: true },
        properties: true,
        villas: true,
      },
    });

    const owners = OwnerPaginationDto.fromEntities(paginatedOwners.data);

    return paginateResponseMapper(paginatedOwners, owners);
  }

  async findOne(id: string): Promise<OwnerWithRelationsDto> {
    const owner = await this.ownerRepository.findOne({
      select: {
        id: true,
        name: true,
        type: true,
        companyName: true,
        phoneCountryCode: true,
        phoneNumber: true,
        email: true,
        address: true,
        website: true,
        status: true,
        activities: {
          id: true,
          name: true,
          highlight: true,
          category: {
            id: true,
            name: true,
          },
        },
        properties: {
          id: true,
          name: true,
          highlight: true,
        },
        villas: {
          id: true,
          name: true,
          highlight: true,
        },
      },
      where: { id },
      relations: {
        activities: { category: true },
        properties: true,
        villas: true,
      },
    });

    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    return OwnerWithRelationsDto.fromEntity(owner);
  }

  async update(
    id: string,
    payload: UpdateOwnerDto,
  ): Promise<OwnerWithRelationsDto> {
    await this.validateExist(id);

    await this.ownerRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.ownerRepository.delete(id);
  }

  async validateExist(id: string) {
    const exists = await this.ownerRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('owner not found');
    }
  }
}
