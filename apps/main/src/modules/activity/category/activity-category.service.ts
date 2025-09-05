import { paginateResponseMapper } from '@apps/main/common/helpers';
import { ActivityCategory } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  ActivityCategoryPaginationDto,
  ActivityCategoryWithRelationsDto,
  CreateActivityCategoryDto,
  UpdateActivityCategoryDto,
} from './dto';

@Injectable()
export class ActivityCategoryService {
  constructor(
    @InjectRepository(ActivityCategory)
    private activityCategoryRepository: Repository<ActivityCategory>,
  ) {}

  async create(
    payload: CreateActivityCategoryDto,
  ): Promise<ActivityCategoryWithRelationsDto> {
    const activityCategoryEntity =
      this.activityCategoryRepository.create(payload);

    const createdActivityCategory = await this.activityCategoryRepository.save(
      activityCategoryEntity,
    );

    return ActivityCategoryWithRelationsDto.fromEntity(createdActivityCategory);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ActivityCategoryPaginationDto[]>> {
    const paginatedActivityCategories = await paginate(
      query,
      this.activityCategoryRepository,
      {
        select: ['id', 'name', 'createdAt', 'activities.id', 'activities.name'],
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        searchableColumns: ['name'],
        relations: { activities: true },
      },
    );

    const activityCategories = ActivityCategoryPaginationDto.fromEntities(
      paginatedActivityCategories.data,
    );

    return paginateResponseMapper(
      paginatedActivityCategories,
      activityCategories,
    );
  }

  async findOne(id: string): Promise<ActivityCategoryWithRelationsDto> {
    const activityCategory = await this.activityCategoryRepository.findOne({
      select: {
        id: true,
        name: true,
        activities: {
          id: true,
          name: true,
          highlight: true,
        },
      },
      where: {
        id,
      },
      relations: {
        activities: true,
      },
    });

    if (!activityCategory) {
      throw new NotFoundException('activity category not found');
    }

    return ActivityCategoryWithRelationsDto.fromEntity(activityCategory);
  }

  async update(
    id: string,
    payload: UpdateActivityCategoryDto,
  ): Promise<ActivityCategoryWithRelationsDto> {
    await this.validateExist(id);

    await this.activityCategoryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.activityCategoryRepository.delete(id);
  }

  async validateExist(id: string) {
    const exists = await this.activityCategoryRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('activity category not found');
    }
  }
}
