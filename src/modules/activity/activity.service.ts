import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Activity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { OwnerService } from '../owner/owner.service';
import { PaginateResponseDataProps } from '../shared/dto';
import { ActivityCategoryService } from './category/activity-category.service';
import {
  ActivityWithRelationsDto,
  CreateActivityDto,
  GetActivitiesDto,
  UpdateActivityDto,
} from './dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private activityCategoryService: ActivityCategoryService,
    private currencyService: CurrencyService,
    private ownerService: OwnerService,
  ) {}

  async create(payload: CreateActivityDto): Promise<ActivityWithRelationsDto> {
    await this._validateRelatedEntities(
      payload.categoryId,
      payload.currencyId,
      payload.ownerId,
    );

    const createdActivity = this.activityRepository.create(payload);

    return await this.activityRepository.save(createdActivity);
  }

  async findAll(
    query: PaginateQuery,
    payload: GetActivitiesDto,
  ): Promise<PaginateResponseDataProps<ActivityWithRelationsDto[]>> {
    const whereCondition = payload.categoryId
      ? { categoryId: payload.categoryId }
      : undefined;

    const paginatedActivity = await paginate(query, this.activityRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['name', 'secondaryName', 'category.name'],
      where: whereCondition,
      relations: {
        category: true,
        currency: true,
        owner: true,
      },
    });

    return paginateResponseMapper(paginatedActivity);
  }

  async findOne(id: string): Promise<ActivityWithRelationsDto> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        currency: true,
        owner: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return plainToInstance(ActivityWithRelationsDto, activity);
  }

  async update(
    id: string,
    payload: UpdateActivityDto,
  ): Promise<ActivityWithRelationsDto> {
    await this.findOne(id);

    await this._validateRelatedEntities(
      payload.categoryId,
      payload.currencyId,
      payload.ownerId,
    );

    await this.activityRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.activityRepository.delete(id);
  }

  private async _validateRelatedEntities(
    categoryId: string,
    currencyId?: string,
    ownerId?: string,
  ): Promise<void> {
    await this.activityCategoryService.findOne(categoryId);

    if (currencyId) {
      await this.currencyService.findOne(currencyId);
    }

    if (ownerId) {
      await this.ownerService.findOne(ownerId);
    }
  }
}
