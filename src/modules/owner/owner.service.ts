import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Owner } from 'src/database/entities';
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

    return await this.ownerRepository.save(owner);
  }

  async findAll(query: PaginateQuery) {
    const paginatedOwner = await paginate(query, this.ownerRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: [
        'name',
        'companyName',
        'email',
        'phoneNumber',
        'website',
        'type',
        'status',
      ],
      relations: {
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
        properties: true,
        villas: true,
      },
    });

    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    return owner;
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
