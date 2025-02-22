import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  CreateFacilityCategoryDto,
  FacilityCategoryDto,
  FacilityCategoryWithRelationsDto,
} from './dto';
import { UpdateFacilityDto } from '../dto';
import { paginateResponseMapper } from 'src/common/helpers';
import { FacilityCategory } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';

@Injectable()
export class FacilityCategoryService {
  constructor(
    @InjectRepository(FacilityCategory)
    private facilityCateogryRepository: Repository<FacilityCategory>,
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
    const paginatedFacilityCategory = await paginate(
      query,
      this.facilityCateogryRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['name'],
        relations: { facilityCategories: { facility: true } },
      },
    );

    const mappedFacilityCategoryData: FacilityCategoryDto[] =
      paginatedFacilityCategory.data.map(
        ({ facilityCategories, ...facilityData }) => ({
          ...facilityData,
          facilites: facilityCategories.map((pivot) => ({
            pivotId: pivot.id,
            ...pivot.facility,
          })),
        }),
      );

    return paginateResponseMapper(
      paginatedFacilityCategory,
      mappedFacilityCategoryData,
    );
  }

  async findOne(id: string): Promise<FacilityCategoryWithRelationsDto> {
    const facilityCategory = await this.facilityCateogryRepository.findOne({
      where: {
        id,
      },
      relations: {
        facilityCategories: { facility: true },
      },
    });

    if (!facilityCategory) {
      throw new NotFoundException('facility category not found');
    }

    const { facilityCategories, ...facilityCategoryData } = facilityCategory;

    return {
      ...facilityCategoryData,
      facilites: facilityCategory.facilityCategories.map((pivot) => ({
        pivotId: pivot.id,
        ...pivot.facility,
      })),
    };
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
