import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, In, Repository } from 'typeorm';
import {
  CreateFacilityDto,
  FacilityDto,
  FacilityWithRelationsDto,
  GetFacilitiesDto,
  UpdateFacilityDto,
} from './dto';
import { PaginateResponseDataProps } from '../shared/dto';
import { paginateResponseMapper } from 'src/common/helpers';
import {
  Facility,
  FacilityCategory,
  FacilityCategoryPivot,
} from 'src/database/entities';

@Injectable()
export class FacilityService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityCategory)
    private facilityCategoryRepository: Repository<FacilityCategory>,
    @InjectRepository(FacilityCategoryPivot)
    private facilityCategoryPivotRepository: Repository<FacilityCategoryPivot>,
  ) {}

  private async _validateCategories(
    categoryIds: string[],
  ): Promise<FacilityCategory[]> {
    const validCategories = await this.facilityCategoryRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    // Compare input category ids and valid category ids
    const validCategoryIds = validCategories.map((category) => category.id);
    const invalidIds = validCategoryIds.filter(
      (id) => !categoryIds.includes(id),
    );

    if (invalidIds.length > 0) {
      throw new NotFoundException(
        `Permissions not found for IDs: ${invalidIds.join(', ')}`,
      );
    }

    return validCategories;
  }

  private async _getAllFacilityRelatedCategory(
    facilityId: string,
  ): Promise<FacilityCategoryPivot[]> {
    const initialFacilityCategoryPivot =
      await this.facilityCategoryPivotRepository.find({
        where: {
          facilityId,
        },
      });

    return initialFacilityCategoryPivot;
  }

  async create(payload: CreateFacilityDto): Promise<FacilityWithRelationsDto> {
    const facility = await this.dataSource.transaction(async (manager) => {
      const createdFacility = manager.create(
        this.facilityRepository.target,
        payload,
      );

      await this.facilityRepository.save(createdFacility);

      if (payload.categoryIds && payload.categoryIds.length > 0) {
        const validcategories = await this._validateCategories(
          payload.categoryIds,
        );

        const facilityCategoryPivot = validcategories.map(
          (facilityCategory) => ({
            facility: createdFacility,
            facilityCategory,
          }),
        );

        const createdFacilityCategoryPivot = manager.create(
          this.facilityCategoryPivotRepository.target,
          facilityCategoryPivot,
        );

        await manager.save(createdFacilityCategoryPivot);
      }

      return createdFacility;
    });

    return facility;
  }

  async findAll(
    query: PaginateQuery,
    payload: GetFacilitiesDto,
  ): Promise<PaginateResponseDataProps<FacilityDto[]>> {
    const whereCondition = payload.categoryIds?.length
      ? { facilityCategories: { facilityCategoryId: In(payload.categoryIds) } }
      : undefined;

    const paginatedFacility = await paginate(query, this.facilityRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['name'],
      where: whereCondition,
      relations: {
        facilityCategories: { facilityCategory: true },
      },
    });

    const mappedFacilityData: FacilityDto[] = paginatedFacility.data.map(
      ({ facilityCategories, ...facilityData }) => ({
        ...facilityData,
        categories: facilityCategories.map((pivot) => ({
          pivotId: pivot.id,
          ...pivot.facilityCategory,
        })),
      }),
    ) as FacilityWithRelationsDto[];

    return paginateResponseMapper(paginatedFacility, mappedFacilityData);
  }

  async findOne(id: string): Promise<FacilityWithRelationsDto> {
    const facility = await this.facilityRepository.findOne({
      where: {
        id,
      },
      relations: {
        facilityCategories: { facilityCategory: true },
      },
    });

    if (!facility) {
      throw new NotFoundException(`facility not found`);
    }

    const { facilityCategories, ...facilityData } = facility;

    return {
      ...facilityData,
      categories: facility.facilityCategories.map((pivot) => ({
        pivotId: pivot.id,
        ...pivot.facilityCategory,
      })),
    };
  }

  async update(
    id: string,
    payload: UpdateFacilityDto,
  ): Promise<FacilityWithRelationsDto> {
    console.log({ payload });
    await this.findOne(id);

    await this.dataSource.transaction(async (manager) => {
      await manager.update(this.facilityRepository.target, id, {
        name: payload.name,
      });

      const updatedFacility = await manager.findOne(
        this.facilityRepository.target,
        {
          where: {
            id,
          },
        },
      );

      if (payload.categoryIds && Array.isArray(payload.categoryIds)) {
        const initialFacilityCategoryPivot =
          await this._getAllFacilityRelatedCategory(id);

        if (
          initialFacilityCategoryPivot &&
          initialFacilityCategoryPivot.length > 0
        ) {
          await manager.delete(
            this.facilityCategoryPivotRepository.target,
            initialFacilityCategoryPivot,
          );

          if (payload.categoryIds.length > 0) {
            const validcategories = await this._validateCategories(
              payload.categoryIds,
            );

            const facilityCategoryPivot = validcategories.map(
              (facilityCategory) => ({
                facility: updatedFacility,
                facilityCategory,
              }),
            );

            const updatedFacilityCategoryPivot = manager.create(
              this.facilityCategoryPivotRepository.target,
              facilityCategoryPivot,
            );

            await manager.save(updatedFacilityCategoryPivot);
          }
        }
      }

      return updatedFacility;
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.facilityRepository.delete(id);
  }
}
