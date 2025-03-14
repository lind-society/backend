import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Facility } from 'src/database/entities';
import { In, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateFacilityDto,
  FacilityDto,
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

      throw new BadRequestException(
        `invalid facility ids: ${invalidFacilityIds.join(', ')}`,
      );
    }
  }

  async create(payload: CreateFacilityDto): Promise<FacilityDto> {
    const createdFacility = this.facilityRepository.create(payload);

    return await this.facilityRepository.save(createdFacility);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<FacilityWithRelationsDto[]>> {
    const paginatedFacility = await paginate(query, this.facilityRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['name'],
    });

    return paginateResponseMapper(paginatedFacility);
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

    return facility;
  }

  async update(
    id: string,
    payload: UpdateFacilityDto,
  ): Promise<FacilityWithRelationsDto> {
    await this.findOne(id);

    await this.facilityRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.facilityRepository.delete(id);
  }
}
