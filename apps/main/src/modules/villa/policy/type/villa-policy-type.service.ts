import { paginateResponseMapper } from '@apps/main/common/helpers';
import { VillaPolicyType } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { In, Repository } from 'typeorm';
import {
  CreateVillaPolicyTypeDto,
  UpdateVillaPolicyTypeDto,
  VillaPolicyTypePaginationDto,
  VillaPolicyTypeWithRelationsDto,
} from './dto';

@Injectable()
export class VillaPolicyTypeService {
  constructor(
    @InjectRepository(VillaPolicyType)
    private villaPolicyTypeRepository: Repository<VillaPolicyType>,
  ) {}

  async create(
    payload: CreateVillaPolicyTypeDto,
  ): Promise<VillaPolicyTypeWithRelationsDto> {
    const villaPolicyTypeEntity =
      this.villaPolicyTypeRepository.create(payload);

    const createdVillaPolicyType = await this.villaPolicyTypeRepository.save(
      villaPolicyTypeEntity,
    );

    return VillaPolicyTypeWithRelationsDto.fromEntity(createdVillaPolicyType);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPolicyTypePaginationDto[]>> {
    const paginatedVillaPolicyTypeCategories = await paginate(
      query,
      this.villaPolicyTypeRepository,
      {
        select: ['id', 'name', 'createdAt'],
        sortableColumns: ['createdAt', 'name'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name'],
      },
    );

    const villaPolicyTypeCategories = VillaPolicyTypePaginationDto.fromEntities(
      paginatedVillaPolicyTypeCategories.data,
    );

    return paginateResponseMapper(
      paginatedVillaPolicyTypeCategories,
      villaPolicyTypeCategories,
    );
  }

  async findOne(id: string): Promise<VillaPolicyTypeWithRelationsDto> {
    const villaPolicyType = await this.villaPolicyTypeRepository.findOne({
      select: {
        id: true,
        name: true,
      },
      where: {
        id,
      },
    });

    if (!villaPolicyType) {
      throw new NotFoundException('villa policy type not found');
    }

    return VillaPolicyTypeWithRelationsDto.fromEntity(villaPolicyType);
  }

  async update(
    id: string,
    payload: UpdateVillaPolicyTypeDto,
  ): Promise<VillaPolicyTypeWithRelationsDto> {
    await this.validateExist(id);

    await this.villaPolicyTypeRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.villaPolicyTypeRepository.delete(id);
  }

  async validateVillaPolicyTypes(
    villaFacilityTypeIds: string[],
  ): Promise<void> {
    const validVillaPolicyTypes = await this.villaPolicyTypeRepository.find({
      where: { id: In(villaFacilityTypeIds) },
    });

    if (validVillaPolicyTypes.length !== villaFacilityTypeIds.length) {
      const validVillaPolicyTypeIds = validVillaPolicyTypes.map(
        (facility) => facility.id,
      );
      const invalidVillaPolicyTypeIds = villaFacilityTypeIds.filter(
        (id) => !validVillaPolicyTypeIds.includes(id),
      );

      if (invalidVillaPolicyTypeIds.length > 0) {
        throw new BadRequestException(
          `invalid villa policy type ids: ${invalidVillaPolicyTypeIds.join(', ')}`,
        );
      }
    }
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.villaPolicyTypeRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('villa policy type not found');
    }
  }
}
