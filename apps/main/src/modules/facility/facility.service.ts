import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Facility } from '@apps/main/database/entities';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { In, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateFacilityDto,
  FacilityPaginationDto,
  FacilityWithRelationsDto,
  UpdateFacilityDto,
} from './dto';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
  ) {}

  async validateFaciliies(facilityIds: string[]): Promise<void> {
    const validFaciliies = await this.facilityRepository.find({
      where: { id: In(facilityIds) },
    });

    if (validFaciliies.length !== facilityIds.length) {
      const validFacilityIds = validFaciliies.map((facility) => facility.id);
      const invalidFacilityIds = facilityIds.filter(
        (id) => !validFacilityIds.includes(id),
      );

      if (invalidFacilityIds.length > 0) {
        throw new BadRequestException(
          `invalid facility ids: ${invalidFacilityIds.join(', ')}`,
        );
      }
    }
  }

  async create(payload: CreateFacilityDto): Promise<FacilityWithRelationsDto> {
    const facilityEntity = this.facilityRepository.create(payload);

    const createdFacility = await this.facilityRepository.save(facilityEntity);

    return FacilityWithRelationsDto.fromEntity(createdFacility);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<FacilityPaginationDto[]>> {
    const paginatedFacilities = await paginate(query, this.facilityRepository, {
      sortableColumns: ['createdAt', 'name', 'type'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        type: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name'],
    });

    const facilities = FacilityPaginationDto.fromEntities(
      paginatedFacilities.data,
    );

    return paginateResponseMapper(paginatedFacilities, facilities);
  }

  async findOne(id: string): Promise<FacilityWithRelationsDto> {
    const facility = await this.facilityRepository.findOne({
      where: {
        id,
      },
    });

    if (!facility) {
      throw new NotFoundException(`facility not found`);
    }

    return FacilityWithRelationsDto.fromEntity(facility);
  }

  async update(
    id: string,
    payload: UpdateFacilityDto,
  ): Promise<FacilityWithRelationsDto> {
    await this.validateExist(id);

    await this.facilityRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.validateExist(id);

    await this.facilityRepository.delete(id);
  }

  async validateExist(id: string) {
    const exists = await this.facilityRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('facility not found');
    }
  }
}
