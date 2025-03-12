import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { VillaPolicy } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
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
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
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
