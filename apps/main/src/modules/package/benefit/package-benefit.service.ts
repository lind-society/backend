import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PackageBenefit } from '@apps/main/database/entities';
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
  CreatePackageBenefitDto,
  PackageBenefitPaginationDto,
  PackageBenefitWithRelationsDto,
  UpdatePackageBenefitDto,
} from './dto';

@Injectable()
export class PackageBenefitService {
  constructor(
    @InjectRepository(PackageBenefit)
    private packageBenefitRepository: Repository<PackageBenefit>,
  ) {}
  async create(
    payload: CreatePackageBenefitDto,
  ): Promise<PackageBenefitWithRelationsDto> {
    const packageBenefitEntity = this.packageBenefitRepository.create(payload);

    const createdPackageBenefit =
      await this.packageBenefitRepository.save(packageBenefitEntity);

    return PackageBenefitWithRelationsDto.fromEntity(createdPackageBenefit);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PackageBenefitPaginationDto[]>> {
    const paginatedPackageBenefits = await paginate(
      query,
      this.packageBenefitRepository,
      {
        select: [
          'id',
          'title',
          'createdAt',

          'packageBenefits.id',
          'packageBenefits.package.id',
          'packageBenefits.package.name',
          'packageBenefits.package.description',
        ],
        sortableColumns: ['createdAt', 'title'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['title'],
        relations: {
          packageBenefits: { package: true },
        },
      },
    );

    const packageBenefits = PackageBenefitPaginationDto.fromEntities(
      paginatedPackageBenefits.data,
    );

    return paginateResponseMapper(paginatedPackageBenefits, packageBenefits);
  }

  async findOne(id: string): Promise<PackageBenefitWithRelationsDto> {
    const packageBenefit = await this.packageBenefitRepository.findOne({
      select: {
        id: true,
        title: true,
        packageBenefits: {
          id: true,
          package: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      where: {
        id,
      },
      relations: {
        packageBenefits: { package: true },
      },
    });

    if (!packageBenefit) {
      throw new NotFoundException('package benefit not found');
    }

    return PackageBenefitWithRelationsDto.fromEntity(packageBenefit);
  }

  async update(
    id: string,
    payload: UpdatePackageBenefitDto,
  ): Promise<PackageBenefitWithRelationsDto> {
    await this.validateExist(id);

    await this.packageBenefitRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.packageBenefitRepository.delete(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.packageBenefitRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('review not found');
    }
  }

  async validatePackageBenefits(packageBenefitIds: string[]): Promise<void> {
    const validPackageBenefits = await this.packageBenefitRepository.find({
      where: { id: In(packageBenefitIds) },
    });

    if (validPackageBenefits.length !== packageBenefitIds.length) {
      const validPackageBenefitIds = validPackageBenefits.map(
        (PackageBenefit) => PackageBenefit.id,
      );
      const invalidPackageBenefitIds = packageBenefitIds.filter(
        (id) => !validPackageBenefitIds.includes(id),
      );

      if (invalidPackageBenefitIds.length > 0) {
        throw new BadRequestException(
          `invalid package benefit ids: ${invalidPackageBenefitIds.join(', ')}`,
        );
      }
    }
  }
}
