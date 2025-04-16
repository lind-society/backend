import { paginateResponseMapper } from '@apps/main/common/helpers';
import { ActivityCategory } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  ActivityCategoryDto,
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
  ): Promise<ActivityCategoryDto> {
    const activityCategory = this.activityCategoryRepository.create(payload);

    return await this.activityCategoryRepository.save(activityCategory);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ActivityCategoryWithRelationsDto[]>> {
    const paginatedActivityCategory = await paginate(
      query,
      this.activityCategoryRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['name'],
        relations: { activities: true },
      },
    );

    return paginateResponseMapper(paginatedActivityCategory);
  }

  async findOne(id: string): Promise<ActivityCategoryWithRelationsDto> {
    const activityCategory = await this.activityCategoryRepository.findOne({
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

    const { activities, ...activityCategoryData } = activityCategory;

    return {
      ...activityCategoryData,
      activities: activities.map((activity) => ({
        ...activity,
      })),
    };
  }

  async update(
    id: string,
    payload: UpdateActivityCategoryDto,
  ): Promise<ActivityCategoryDto> {
    await this.findOne(id);

    await this.activityCategoryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.activityCategoryRepository.delete(id);
  }
}
