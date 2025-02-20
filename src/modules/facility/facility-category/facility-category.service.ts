import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityCategoryDto } from './dto/create-facility-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityCategory } from 'src/database/entities/facility-category.entity';
import { Repository } from 'typeorm';
import { FacilityCategoryDto } from './dto';
import { UpdateFacilityDto } from '../dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateResponseDataProps } from 'src/modules/shared/dto/paginated-response.dto';
import { paginateResponseMapper } from 'src/common/helpers/paginate-response-mapper.helper';

@Injectable()
export class FacilityCategoryService {
  constructor(
    @InjectRepository(FacilityCategory)
    private facilityCateogryRepository: Repository<FacilityCategoryDto>,
  ) {}
  async create(
    payload: CreateFacilityCategoryDto,
  ): Promise<FacilityCategoryDto> {
    const facilityCategory = this.facilityCateogryRepository.create(payload);

    return await this.facilityCateogryRepository.save(facilityCategory);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<FacilityCategoryDto[]>> {
    const paginatedFacilityCategories = await paginate(
      query,
      this.facilityCateogryRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['name'],
      },
    );

    return paginateResponseMapper(paginatedFacilityCategories);
  }

  async findOne(id: string): Promise<FacilityCategoryDto> {
    const facilityCategory = await this.facilityCateogryRepository.findOne({
      where: {
        id,
      },
    });

    if (!facilityCategory) {
      throw new NotFoundException('facility category not found');
    }

    return facilityCategory;
  }

  async update(
    id: string,
    payload: UpdateFacilityDto,
  ): Promise<FacilityCategoryDto> {
    await this.findOne(id);

    await this.facilityCateogryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.facilityCateogryRepository.delete(id);
  }
}
