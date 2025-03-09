import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Additional } from 'src/database/entities';
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
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
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
